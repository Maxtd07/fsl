using Microsoft.EntityFrameworkCore;
using SoccerDreamFermana.Backend.Data;

namespace SoccerDreamFermana.Backend.Services;

public sealed class BookingReminderWorker(
    IServiceScopeFactory scopeFactory,
    IConfiguration configuration,
    ILogger<BookingReminderWorker> logger
) : BackgroundService
{
    private readonly bool _enabled = bool.TryParse(
        ConfigurationReader.Get(configuration, "REMINDERS_ENABLED", "Reminders:Enabled"),
        out var enabled
    )
        ? enabled
        : true;

    private readonly int _hoursBefore = int.TryParse(
        ConfigurationReader.Get(configuration, "REMINDER_HOURS_BEFORE", "Reminders:HoursBefore"),
        out var hoursBefore
    )
        ? Math.Max(1, hoursBefore)
        : 24;

    private readonly int _scanIntervalMinutes = int.TryParse(
        ConfigurationReader.Get(configuration, "REMINDER_SCAN_INTERVAL_MINUTES", "Reminders:ScanIntervalMinutes"),
        out var scanIntervalMinutes
    )
        ? Math.Max(1, scanIntervalMinutes)
        : 60;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_enabled)
        {
            logger.LogInformation("Promemoria eventi disabilitati");
            return;
        }

        logger.LogInformation(
            "Promemoria eventi attivi: invio entro {HoursBefore} ore, controllo ogni {Minutes} minuti",
            _hoursBefore,
            _scanIntervalMinutes
        );

        await SendDueRemindersAsync(stoppingToken);

        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(_scanIntervalMinutes));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await SendDueRemindersAsync(stoppingToken);
        }
    }

    private async Task SendDueRemindersAsync(CancellationToken cancellationToken)
    {
        try
        {
            await using var scope = scopeFactory.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<EmailService>();

            var now = DateTime.Now;
            var reminderWindowEnd = now.AddHours(_hoursBefore);

            var bookings = await db.Bookings
                .Include(booking => booking.User)
                .Include(booking => booking.Event)
                .Where(booking =>
                    booking.ReminderSentAt == null
                    && booking.Event.Data > now
                    && booking.Event.Data <= reminderWindowEnd
                )
                .OrderBy(booking => booking.Event.Data)
                .ThenBy(booking => booking.Id)
                .ToListAsync(cancellationToken);

            foreach (var booking in bookings)
            {
                var sent = await emailService.SendBookingReminderAsync(booking.User, booking.Event, cancellationToken);
                if (!sent)
                {
                    continue;
                }

                booking.ReminderSentAt = DateTime.Now;
                await db.SaveChangesAsync(cancellationToken);
                logger.LogInformation(
                    "Promemoria evento inviato a {Email} per evento {EventId}",
                    booking.User.Email,
                    booking.EventId
                );
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Invio promemoria eventi non riuscito");
        }
    }
}
