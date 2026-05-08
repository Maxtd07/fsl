using Microsoft.EntityFrameworkCore;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Exceptions;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Services;

public sealed class BookingService(
    AppDbContext db,
    EventService eventService,
    AuthService authService,
    EmailService emailService
)
{
    private const string BookingNotFoundMessage = "Iscrizione non trovata";
    private const string AlreadyBookedMessage = "Sei gia iscritto a questo evento";
    private const string EventFullMessage = "L'evento e al completo";

    public async Task<BookingResponse> CreateAsync(long eventId, long userId, CancellationToken cancellationToken)
    {
        var item = await eventService.GetEntityByIdAsync(eventId, cancellationToken);
        var user = await authService.FindByIdAsync(userId, cancellationToken);
        await ValidateBookingAvailabilityAsync(eventId, item, userId, cancellationToken);

        var booking = new Booking { EventId = item.Id, UserId = user.Id, Event = item, User = user };
        db.Bookings.Add(booking);
        await db.SaveChangesAsync(cancellationToken);

        return ToResponse(booking, await emailService.SendBookingConfirmationAsync(user, item, cancellationToken));
    }

    public async Task<IReadOnlyList<BookingResponse>> GetByUserAsync(long userId, CancellationToken cancellationToken)
    {
        var bookings = await db.Bookings
            .AsNoTracking()
            .Include(booking => booking.Event)
            .Include(booking => booking.User)
            .Where(booking => booking.UserId == userId)
            .OrderByDescending(booking => booking.CreatedAt)
            .ToListAsync(cancellationToken);

        return bookings.Select(booking => ToResponse(booking, false)).ToList();
    }

    public async Task<IReadOnlyList<BookingResponse>> GetByEventAsync(long eventId, CancellationToken cancellationToken)
    {
        await eventService.GetEntityByIdAsync(eventId, cancellationToken);

        var bookings = await db.Bookings
            .AsNoTracking()
            .Include(booking => booking.Event)
            .Include(booking => booking.User)
            .Where(booking => booking.EventId == eventId)
            .OrderByDescending(booking => booking.CreatedAt)
            .ToListAsync(cancellationToken);

        return bookings.Select(booking => ToResponse(booking, false)).ToList();
    }

    public async Task DeleteAsync(long id, CancellationToken cancellationToken)
    {
        db.Bookings.Remove(await FindBookingByIdAsync(id, cancellationToken));
        await db.SaveChangesAsync(cancellationToken);
    }

    private async Task ValidateBookingAvailabilityAsync(
        long eventId,
        Event item,
        long userId,
        CancellationToken cancellationToken
    )
    {
        if (await db.Bookings.AnyAsync(booking => booking.UserId == userId && booking.EventId == eventId, cancellationToken))
        {
            throw new BadRequestException(AlreadyBookedMessage);
        }

        var count = await db.Bookings.LongCountAsync(booking => booking.EventId == eventId, cancellationToken);
        if (!item.UnlimitedCapacity && count >= item.MaxPartecipanti)
        {
            throw new BadRequestException(EventFullMessage);
        }
    }

    private async Task<Booking> FindBookingByIdAsync(long id, CancellationToken cancellationToken)
    {
        return await db.Bookings.FindAsync(new object?[] { id }, cancellationToken)
            ?? throw new ResourceNotFoundException(BookingNotFoundMessage);
    }

    private static BookingResponse ToResponse(Booking booking, bool emailSent)
    {
        return new BookingResponse(
            booking.Id,
            booking.Event.Id,
            NormalizeEventType(booking.Event.Tipo),
            booking.Event.Titolo,
            booking.Event.Data,
            booking.Event.Luogo,
            booking.User.Id,
            booking.User.Nome,
            booking.User.Email,
            booking.CreatedAt,
            emailSent,
            $"/api/events/{booking.Event.Id}/calendar"
        );
    }

    private static string NormalizeEventType(string? value)
    {
        return value?.Trim().ToLowerInvariant() == "partita" ? "partita" : "evento";
    }
}
