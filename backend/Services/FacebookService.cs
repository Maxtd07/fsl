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
    private const string DefaultApiVersion = "v23.0";
    private const int DefaultPostLimit = 12;
    private const int MaxPostLimit = 100;
    private const string PostsFields = "id,message,full_picture,created_time,permalink_url,attachments{type,url,title,description,media,subattachments{type,url,title,description,media}}";
    private const string PagesFields = "id,name,access_token";
    private const string MeFields = "id,name";
    private static readonly string[] PostsEndpoints = ["/posts", "/published_posts", "/feed"];
    private readonly string? _pageId = ConfigurationReader.Get(configuration, "FACEBOOK_PAGE_ID", "Facebook:PageId");
    private readonly string? _accessToken = ConfigurationReader.Get(configuration, "FACEBOOK_ACCESS_TOKEN", "Facebook:AccessToken");
    private readonly int _postLimit = ReadPositiveInt(
        ConfigurationReader.Get(configuration, "FACEBOOK_POST_LIMIT", "Facebook:PostLimit"),
        DefaultPostLimit,
        MaxPostLimit
    );
    private readonly string _facebookApiUrl = BuildApiUrl(
        ConfigurationReader.Get(configuration, "FACEBOOK_API_VERSION", "Facebook:ApiVersion")
    );

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
                logger.LogWarning(
                    "Facebook posts unavailable with the current token/page configuration. Returning an empty feed."
                );
                return [];
            }

            return data.Select(ToResponse).ToList();
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
            return targets;
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
                var data = await FetchAllDataAsync(
                    "/" + target.ResourceId + endpoint,
                    PostsFields,
                    target.AccessToken,
                    _postLimit,
                    cancellationToken
                );
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

    private async Task<List<JsonElement>> FetchAllDataAsync(
        string path,
        string fields,
        string token,
        int maxResults,
        CancellationToken cancellationToken
    )
    {
        var results = new List<JsonElement>();
        var nextUrl = BuildUrl(path, fields, token, Math.Min(maxResults, MaxPostLimit));
        var pageCount = 0;

        while (IsConfigured(nextUrl) && pageCount < 5 && results.Count < maxResults)
        {
            pageCount++;
            var response = await ExecuteGetByUrlAsync(nextUrl!, cancellationToken);
            results.AddRange(ExtractData(response));
            nextUrl = ExtractNextUrl(response);
        }

        return DeduplicateById(results).Take(maxResults).ToList();
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

    private string BuildUrl(string path, string fields, string token, int? limit)
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

        return _facebookApiUrl + path + "?" + string.Join("&", query.Select(pair =>
            $"{Uri.EscapeDataString(pair.Key)}={Uri.EscapeDataString(pair.Value ?? "")}"
        ));
    }

    private static string BuildApiUrl(string? configuredVersion)
    {
        var version = configuredVersion?.Trim();
        if (!IsConfigured(version))
        {
            version = DefaultApiVersion;
        }
        else if (char.IsDigit(version![0]))
        {
            version = "v" + version;
        }

        return $"https://graph.facebook.com/{version}";
    }

    private static int ReadPositiveInt(string? value, int fallback, int max)
    {
        return int.TryParse(value, out var parsed) && parsed > 0
            ? Math.Min(parsed, max)
            : fallback;
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
        var media = ExtractMedia(post);

        return new FacebookPostResponse(
            ReadString(post, "id"),
            ReadString(post, "message"),
            ReadString(post, "full_picture"),
            ReadString(post, "created_time"),
            ReadString(post, "permalink_url"),
            ReadAttachmentType(post),
            media
        );
    }

    private static IReadOnlyList<FacebookMediaResponse> ExtractMedia(JsonElement post)
    {
        var media = new List<FacebookMediaResponse>();

        if (post.TryGetProperty("attachments", out var attachments)
            && attachments.TryGetProperty("data", out var attachmentData)
            && attachmentData.ValueKind == JsonValueKind.Array)
        {
            foreach (var attachment in attachmentData.EnumerateArray())
            {
                if (attachment.TryGetProperty("subattachments", out var subattachments)
                    && subattachments.TryGetProperty("data", out var subattachmentData)
                    && subattachmentData.ValueKind == JsonValueKind.Array)
                {
                    media.AddRange(subattachmentData.EnumerateArray().Select(ToMediaResponse));
                    continue;
                }

                media.Add(ToMediaResponse(attachment));
            }
        }

        if (media.Count == 0 && IsConfigured(ReadString(post, "full_picture")))
        {
            media.Add(new FacebookMediaResponse(
                null,
                ReadString(post, "permalink_url"),
                ReadString(post, "full_picture"),
                null,
                null,
                null,
                null
            ));
        }

        return media
            .Where(item => IsConfigured(item.ImageUrl) || IsConfigured(item.Url))
            .ToList();
    }

    private static FacebookMediaResponse ToMediaResponse(JsonElement attachment)
    {
        var image = ReadImage(attachment);
        return new FacebookMediaResponse(
            ReadString(attachment, "type"),
            ReadString(attachment, "url"),
            image.Url,
            image.Width,
            image.Height,
            ReadString(attachment, "title"),
            ReadString(attachment, "description")
        );
    }

    private static string? ReadAttachmentType(JsonElement post)
    {
        return post.TryGetProperty("attachments", out var attachments)
            && attachments.TryGetProperty("data", out var data)
            && data.ValueKind == JsonValueKind.Array
            ? data.EnumerateArray().Select(item => ReadString(item, "type")).FirstOrDefault(IsConfigured)
            : null;
    }

    private static FacebookImage ReadImage(JsonElement attachment)
    {
        if (!attachment.TryGetProperty("media", out var media)
            || !media.TryGetProperty("image", out var image))
        {
            return new FacebookImage(null, null, null);
        }

        return new FacebookImage(
            ReadString(image, "src"),
            ReadInt(image, "width"),
            ReadInt(image, "height")
        );
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

    private static int? ReadInt(JsonElement element, string property)
    {
        return element.TryGetProperty(property, out var value)
            && value.ValueKind == JsonValueKind.Number
            && value.TryGetInt32(out var result)
                ? result
                : null;
    }

    private static bool IsConfigured(string? value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    private sealed record FacebookFeedTarget(string ResourceId, string AccessToken, string Source);

    private sealed record FacebookImage(string? Url, int? Width, int? Height);

    private sealed class FacebookApiException(string message) : Exception(message);
}
