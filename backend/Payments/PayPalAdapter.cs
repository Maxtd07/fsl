using System.Globalization;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Exceptions;

namespace SoccerDreamFermana.Backend.Payments;

public sealed class PayPalAdapter(IHttpClientFactory httpClientFactory, IConfiguration configuration) : IPaymentAdapter
{
    private readonly string? _clientId = ConfigurationReader.Get(configuration, "PAYPAL_CLIENT_ID", "PayPal:ClientId");
    private readonly string? _clientSecret = ConfigurationReader.Get(configuration, "PAYPAL_CLIENT_SECRET", "PayPal:ClientSecret");
    private readonly string _baseUrl = ConfigurationReader.Get(configuration, "PAYPAL_BASE_URL", "PayPal:BaseUrl", "https://api-m.sandbox.paypal.com").TrimEnd('/');
    private readonly string _currency = ConfigurationReader.Get(configuration, "PAYPAL_CURRENCY", "PayPal:Currency", "EUR");

    public async Task<CreatePaymentResponse> CreatePaymentAsync(CreatePaymentRequest request, CancellationToken cancellationToken)
    {
        EnsureConfigured();

        var client = httpClientFactory.CreateClient();
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/v2/checkout/orders");
        httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await FetchAccessTokenAsync(cancellationToken));
        httpRequest.Content = JsonContent.Create(new
        {
            intent = "CAPTURE",
            purchase_units = new[]
            {
                new
                {
                    description = "Donazione - Associazione Disabili " + request.Nome,
                    amount = new
                    {
                        currency_code = _currency,
                        value = request.Importo.ToString("0.00", CultureInfo.InvariantCulture)
                    }
                }
            },
            payment_source = new
            {
                paypal = new
                {
                    experience_context = new
                    {
                        payment_method_preference = "IMMEDIATE_PAYMENT_REQUIRED",
                        shipping_preference = "NO_SHIPPING",
                        user_action = "PAY_NOW"
                    }
                }
            }
        });

        using var response = await client.SendAsync(httpRequest, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            throw new BadRequestException("Errore durante la creazione dell'ordine PayPal");
        }

        using var document = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
        var root = document.RootElement;
        return new CreatePaymentResponse(
            ReadString(root, "id"),
            ReadString(root, "status"),
            ExtractApprovalUrl(root)
        );
    }

    public async Task<CapturePaymentResponse> CapturePaymentAsync(string orderId, CancellationToken cancellationToken)
    {
        EnsureConfigured();

        var client = httpClientFactory.CreateClient();
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/v2/checkout/orders/{Uri.EscapeDataString(orderId)}/capture");
        httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await FetchAccessTokenAsync(cancellationToken));
        httpRequest.Content = JsonContent.Create(new { });

        using var response = await client.SendAsync(httpRequest, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            throw new BadRequestException("Errore durante la cattura del pagamento PayPal");
        }

        using var document = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
        var root = document.RootElement;
        var payerId = root.TryGetProperty("payer", out var payer) ? ReadString(payer, "payer_id") : null;
        string? captureId = null;

        if (root.TryGetProperty("purchase_units", out var purchaseUnits)
            && purchaseUnits.ValueKind == JsonValueKind.Array
            && purchaseUnits.GetArrayLength() > 0
            && purchaseUnits[0].TryGetProperty("payments", out var payments)
            && payments.TryGetProperty("captures", out var captures)
            && captures.ValueKind == JsonValueKind.Array
            && captures.GetArrayLength() > 0)
        {
            captureId = ReadString(captures[0], "id");
        }

        return new CapturePaymentResponse(ReadString(root, "id"), ReadString(root, "status"), payerId, captureId);
    }

    private async Task<string> FetchAccessTokenAsync(CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/v1/oauth2/token");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Basic",
            Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"))
        );
        request.Content = new FormUrlEncodedContent(new Dictionary<string, string> { ["grant_type"] = "client_credentials" });

        using var response = await client.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            throw new BadRequestException("Autenticazione PayPal non riuscita");
        }

        using var document = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
        return ReadString(document.RootElement, "access_token")
            ?? throw new BadRequestException("Impossibile ottenere il token PayPal");
    }

    private void EnsureConfigured()
    {
        if (string.IsNullOrWhiteSpace(_clientId) || string.IsNullOrWhiteSpace(_clientSecret))
        {
            throw new BadRequestException("Configura PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET per usare PayPal");
        }
    }

    private static string? ExtractApprovalUrl(JsonElement root)
    {
        if (!root.TryGetProperty("links", out var links) || links.ValueKind != JsonValueKind.Array)
        {
            return null;
        }

        foreach (var link in links.EnumerateArray())
        {
            if ("approve".Equals(ReadString(link, "rel"), StringComparison.OrdinalIgnoreCase))
            {
                return ReadString(link, "href");
            }
        }

        return null;
    }

    private static string? ReadString(JsonElement element, string property)
    {
        return element.TryGetProperty(property, out var value) && value.ValueKind != JsonValueKind.Null
            ? value.ToString()
            : null;
    }
}
