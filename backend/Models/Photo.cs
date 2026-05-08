namespace SoccerDreamFermana.Backend.Models;

public sealed class Photo
{
    public long Id { get; set; }
    public string? Titolo { get; set; }
    public string? Descrizione { get; set; }
    public string? Immagine { get; set; }
    public DateTime CreatedAt { get; set; }
}
