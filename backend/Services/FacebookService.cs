using System.Text.Json;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Exceptions;

namespace SoccerDreamFermana.Backend.Services;

public sealed class FacebookService(
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration,
    ILogger<FacebookService> logger
)
{
    private const string FacebookApiUrl = "https://graph.facebook.com/v19.0";
    private const string PostsFields = "id,message,full_picture,created_time,permalink_url,likes.summary(total_count).limit(0),comments.summary(total_count).limit(0)";
    private const string SafePostsFields = "id,message,full_picture,created_time,permalink_url";
    private const string PagesFields = "id,name,access_token";
    private const string MeFields = "id,name";
    private static readonly string[] PostsEndpoints = ["/posts", "/published_posts", "/feed"];
    private readonly string? _pageId = ConfigurationReader.Get(configuration, "FACEBOOK_PAGE_ID", "Facebook:PageId");
    private readonly string? _accessToken = ConfigurationReader.Get(configuration, "FACEBOOK_ACCESS_TOKEN", "Facebook:AccessToken");

    public async Task<IReadOnlyList<FacebookPostResponse>> GetFacebookPostsAsync(CancellationToken cancellationToken)
    {
        if (!IsConfigured(_accessToken))
        {
            logger.LogWarning("Facebook access token not configured");
            return [];
        }

        try
        {
            var targets = await ResolveFeedTargetsAsync(cancellationToken);
            if (targets.Count == 0)
            {
                logger.LogWarning("Unable to resolve a Facebook page from the configured token");
                return [];
            }

            var failures = new List<string>();
            List<JsonElement> data = [];

            foreach (var target in targets)
            {
                try
                {
                    data = await FetchPostsForTargetAsync(target, cancellationToken);
                }
                catch (FacebookApiException ex)
                {
                    failures.Add(ex.Message);
                    logger.LogWarning(ex, "Facebook fetch failed for resource {ResourceId}", target.ResourceId);
                    continue;
                }

                if (data.Count > 0)
                {
                    break;
                }
            }

            if (data.Count == 0 && failures.Count > 0)
            {
                throw new BadRequestException(
                    "Impossibile leggere i post Facebook. Verifica token pagina, ID pagina e permessi pages_show_list/pages_read_engagement/pages_read_user_content."
                );
            }

            return data.Select(ToResponse).ToList();
        }
        catch (BadRequestException)
        {
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while fetching Facebook posts");
            return [];
        }
    }

    private async Task<List<FacebookFeedTarget>> ResolveFeedTargetsAsync(CancellationToken cancellationToken)
    {
        var targets = new List<FacebookFeedTarget>();
        var seenTargets = new HashSet<string>(StringComparer.Ordinal);

        if (IsConfigured(_pageId))
        {
            AddTarget(targets, seenTargets, _pageId!, _accessToken!, "configured page id");
        }

        var pages = await ReadManagedPagesAsync(cancellationToken);
        foreach (var page in pages.OrderBy(page => IsMatchingConfiguredPage(page) ? 0 : 1))
        {
            var discoveredPageId = ReadString(page, "id");
            var discoveredPageToken = ReadString(page, "access_token");
            var effectiveToken = IsConfigured(discoveredPageToken) ? discoveredPageToken! : _accessToken!;
            var source = IsMatchingConfiguredPage(page) ? "page token discovered from /me/accounts" : "page discovered from /me/accounts";
            AddTarget(targets, seenTargets, discoveredPageId, effectiveToken, source);
        }

        if (!IsConfigured(_pageId))
        {
            try
            {
                var meResponse = await ExecuteGetAsync("/me", MeFields, _accessToken!, null, cancellationToken);
                var meId = ReadString(meResponse, "id");
                if (IsConfigured(meId))
                {
                    AddTarget(targets, seenTargets, meId, _accessToken!, "resource resolved from /me");
                }
            }
            catch (FacebookApiException ex)
            {
                logger.LogWarning(ex, "Unable to resolve Facebook /me resource");
            }
        }

        return targets;
    }

    private async Task<List<JsonElement>> FetchPostsForTargetAsync(FacebookFeedTarget target, CancellationToken cancellationToken)
    {
        FacebookApiException? lastError = null;

        foreach (var endpoint in PostsEndpoints)
        {
            try
            {
                var data = await FetchEndpointWithFallbackAsync(target, endpoint, cancellationToken);
                if (data.Count > 0)
                {
                    return data;
                }
            }
            catch (FacebookApiException ex)
            {
                lastError = ex;
                logger.LogInformation(ex, "Endpoint {Endpoint} unavailable for resource {ResourceId}", endpoint, target.ResourceId);
            }
        }

        if (lastError is not null)
        {
            throw lastError;
        }

        return [];
    }

    private async Task<List<JsonElement>> FetchEndpointWithFallbackAsync(
        FacebookFeedTarget target,
        string endpoint,
        CancellationToken cancellationToken
    )
    {
        var path = "/" + target.ResourceId + endpoint;

        try
        {
            return await FetchAllDataAsync(path, PostsFields, target.AccessToken, cancellationToken);
        }
        catch (FacebookApiException ex) when (RequiresEngagementPermission(ex))
        {
            logger.LogInformation("Engagement fields unavailable for {Path}. Falling back to safe post fields.", path);
            return await FetchAllDataAsync(path, SafePostsFields, target.AccessToken, cancellationToken);
        }
    }

    private async Task<List<JsonElement>> FetchAllDataAsync(
        string path,
        string fields,
        string token,
        CancellationToken cancellationToken
    )
    {
        var results = new List<JsonElement>();
        var nextUrl = BuildUrl(path, fields, token, 100);
        var pageCount = 0;

        while (IsConfigured(nextUrl) && pageCount < 50)
        {
            pageCount++;
            var response = await ExecuteGetByUrlAsync(nextUrl!, cancellationToken);
            results.AddRange(ExtractData(response));
            nextUrl = ExtractNextUrl(response);
        }

        return DeduplicateById(results);
    }

    private async Task<List<JsonElement>> ReadManagedPagesAsync(CancellationToken cancellationToken)
    {
        try
        {
            return ExtractData(await ExecuteGetAsync("/me/accounts", PagesFields, _accessToken!, 25, cancellationToken));
        }
        catch (FacebookApiException ex)
        {
            logger.LogInformation(ex, "Unable to inspect /me/accounts with the configured token");
            return [];
        }
    }

    private async Task<JsonElement> ExecuteGetAsync(
        string path,
        string fields,
        string token,
        int? limit,
        CancellationToken cancellationToken
    )
    {
        return await ExecuteGetByUrlAsync(BuildUrl(path, fields, token, limit), cancellationToken);
    }

    private async Task<JsonElement> ExecuteGetByUrlAsync(string url, CancellationToken cancellationToken)
    {
        using var response = await httpClientFactory.CreateClient().GetAsync(url, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new FacebookApiException(content);
        }

        using var document = JsonDocument.Parse(content);
        var root = document.RootElement.Clone();
        if (root.TryGetProperty("error", out var error))
        {
            throw new FacebookApiException(ExtractErrorMessage(error));
        }

        return root;
    }

    private static string BuildUrl(string path, string fields, string token, int? limit)
    {
        var query = new Dictionary<string, string?>
        {
            ["fields"] = fields,
            ["access_token"] = token
        };

        if (limit is not null)
        {
            query["limit"] = limit.Value.ToString();
        }

        return FacebookApiUrl + path + "?" + string.Join("&", query.Select(pair =>
            $"{Uri.EscapeDataString(pair.Key)}={Uri.EscapeDataString(pair.Value ?? "")}"
        ));
    }

    private static List<JsonElement> ExtractData(JsonElement response)
    {
        if (!response.TryGetProperty("data", out var data) || data.ValueKind != JsonValueKind.Array)
        {
            return [];
        }

        return data.EnumerateArray().Select(item => item.Clone()).ToList();
    }

    private static string? ExtractNextUrl(JsonElement response)
    {
        return response.TryGetProperty("paging", out var paging)
            && paging.TryGetProperty("next", out var next)
            && next.ValueKind == JsonValueKind.String
                ? next.GetString()
                : null;
    }

    private static List<JsonElement> DeduplicateById(List<JsonElement> items)
    {
        var unique = new Dictionary<string, JsonElement>(StringComparer.Ordinal);
        foreach (var item in items)
        {
            var id = ReadString(item, "id");
            if (IsConfigured(id))
            {
                unique.TryAdd(id!, item);
            }
        }

        return unique.Values.ToList();
    }

    private void AddTarget(
        List<FacebookFeedTarget> targets,
        HashSet<string> seenTargets,
        string? resourceId,
        string token,
        string source
    )
    {
        if (!IsConfigured(resourceId) || !IsConfigured(token))
        {
            return;
        }

        var signature = resourceId!.Trim() + "|" + token.Trim();
        if (seenTargets.Add(signature))
        {
            targets.Add(new FacebookFeedTarget(resourceId.Trim(), token.Trim(), source));
        }
    }

    private bool IsMatchingConfiguredPage(JsonElement page)
    {
        return IsConfigured(_pageId) && _pageId!.Trim() == ReadString(page, "id");
    }

    private static FacebookPostResponse ToResponse(JsonElement post)
    {
        return new FacebookPostResponse(
            ReadString(post, "id"),
            ReadString(post, "message"),
            ReadString(post, "full_picture"),
            ReadString(post, "created_time"),
            ReadString(post, "permalink_url"),
            ExtractCount(post, "likes"),
            ExtractCount(post, "comments")
        );
    }

    private static long ExtractCount(JsonElement post, string property)
    {
        if (!post.TryGetProperty(property, out var value)
            || !value.TryGetProperty("summary", out var summary)
            || !summary.TryGetProperty("total_count", out var count))
        {
            return 0;
        }

        return count.ValueKind == JsonValueKind.Number && count.TryGetInt64(out var result) ? result : 0;
    }

    private static bool RequiresEngagementPermission(FacebookApiException error)
    {
        return error.Message.Contains("pages_read_engagement", StringComparison.OrdinalIgnoreCase)
            || error.Message.Contains("Page Public Content Access", StringComparison.OrdinalIgnoreCase);
    }

    private static string ExtractErrorMessage(JsonElement error)
    {
        return ReadString(error, "message") ?? "Facebook Graph API error";
    }

    private static string? ReadString(JsonElement element, string property)
    {
        return element.TryGetProperty(property, out var value) && value.ValueKind != JsonValueKind.Null
            ? value.ToString()
            : null;
    }

    private static bool IsConfigured(string? value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    private sealed record FacebookFeedTarget(string ResourceId, string AccessToken, string Source);

    private sealed class FacebookApiException(string message) : Exception(message);
}
