using System.ComponentModel.DataAnnotations;

namespace SoccerDreamFermana.Backend.Dtos;

public sealed record CreatePaymentRequest(
    [Required(ErrorMessage = "Il nome e obbligatorio")]
    [MaxLength(120, ErrorMessage = "Il nome non puo superare 120 caratteri")]
    string Nome,

    [Required(ErrorMessage = "L'email e obbligatoria")]
    [EmailAddress(ErrorMessage = "Inserisci un indirizzo email valido")]
    string Email,

    [Range(1.0, double.MaxValue, ErrorMessage = "L'importo minimo e 1 euro")]
    double Importo
);

public sealed record CreatePaymentResponse(string? OrderId, string? Status, string? ApprovalUrl);

public sealed record CapturePaymentRequest(
    [Required(ErrorMessage = "L'orderId e obbligatorio")]
    string OrderId
);

public sealed record CapturePaymentResponse(string? OrderId, string? Status, string? PayerId, string? CaptureId);

public sealed record DonationRequest(
    [Required(ErrorMessage = "Il nome e obbligatorio")]
    [MaxLength(120, ErrorMessage = "Il nome non puo superare 120 caratteri")]
    string Nome,

    [Required(ErrorMessage = "L'email e obbligatoria")]
    [EmailAddress(ErrorMessage = "Inserisci un indirizzo email valido")]
    string Email,

    [Range(1.0, double.MaxValue, ErrorMessage = "L'importo minimo e 1 euro")]
    double Importo,

    [Required(ErrorMessage = "L'orderId PayPal e obbligatorio")]
    string PaypalOrderId,

    string? PayerId,
    string? CaptureId,
    string? PaymentStatus
);

public sealed record DonationResponse(
    long Id,
    string Nome,
    string Email,
    double Importo,
    string? PaypalOrderId,
    string? PayerId,
    string? CaptureId,
    string? PaymentStatus,
    DateTime CreatedAt
);
