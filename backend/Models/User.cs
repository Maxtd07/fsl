namespace SoccerDreamFermana.Backend.Models;

public sealed class User
{
    public long Id { get; set; }
    public string Nome { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public Role Ruolo { get; set; } = Role.USER;
    public DateTime CreatedAt { get; set; }
    public List<Booking> Bookings { get; set; } = [];
}
