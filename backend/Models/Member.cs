namespace SoccerDreamFermana.Backend.Models;

public sealed class Member
{
    public long Id { get; set; }
    public string Name { get; set; } = "";
    public string Role { get; set; } = "";
    public string? Position { get; set; }
    public int? ShirtNumber { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
