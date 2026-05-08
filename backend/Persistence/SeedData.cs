using Microsoft.EntityFrameworkCore;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        var db = services.GetRequiredService<AppDbContext>();
        var configuration = services.GetRequiredService<IConfiguration>();
        var adminName = configuration["ADMIN_NAME"] ?? "Admin soccerdream";
        var adminEmail = (configuration["ADMIN_EMAIL"] ?? "admin@soccerdream.it").Trim().ToLowerInvariant();
        var adminPassword = configuration["ADMIN_PASSWORD"] ?? "ilsognofermana";

        if (!await db.Users.AnyAsync(user => user.Email == adminEmail))
        {
            db.Users.Add(new User
            {
                Nome = adminName,
                Email = adminEmail,
                Password = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                Ruolo = Role.ADMIN
            });
        }

        var events = await db.Events.ToListAsync();
        if (events.Count == 2 && events.All(IsDefaultSeedEvent))
        {
            db.Events.RemoveRange(events);
        }

        await db.SaveChangesAsync();
    }

    private static bool IsDefaultSeedEvent(Event item)
    {
        return item.Titolo is "Laboratorio inclusivo di primavera" or "Incontro di sostegno per caregiver";
    }
}
