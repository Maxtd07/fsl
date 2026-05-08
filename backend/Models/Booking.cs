namespace SoccerDreamFermana.Backend.Models;

public sealed class Booking
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public User User { get; set; } = null!;
    public long EventId { get; set; }
    public Event Event { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
