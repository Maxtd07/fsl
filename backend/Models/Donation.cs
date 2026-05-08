namespace SoccerDreamFermana.Backend.Models;

public sealed class Donation
{
    public long Id { get; set; }
    public string Nome { get; set; } = "";
    public string Email { get; set; } = "";
    public double Importo { get; set; }
    public string? PaypalOrderId { get; set; }
    public string? PayerId { get; set; }
    public string? CaptureId { get; set; }
    public string? PaymentStatus { get; set; }
    public DateTime CreatedAt { get; set; }
}
