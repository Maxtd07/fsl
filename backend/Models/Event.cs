namespace SoccerDreamFermana.Backend.Models;

public sealed class Event
{
    public long Id { get; set; }
    public string Titolo { get; set; } = "";
    public string? Tipo { get; set; }
    public string Descrizione { get; set; } = "";
    public DateTime Data { get; set; }
    public DateTime? DataFine { get; set; }
    public string Luogo { get; set; } = "";
    public int MaxPartecipanti { get; set; }
    public bool UnlimitedCapacity { get; set; }
    public string? Volantino { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<Booking> Bookings { get; set; } = [];
}
