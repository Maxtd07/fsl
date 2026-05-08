using Microsoft.EntityFrameworkCore;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Exceptions;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Services;

public sealed class EventService(AppDbContext db)
{
    private const string EventNotFoundMessage = "Evento non trovato";
    private const string InvalidDateRangeMessage = "La data di inizio deve essere prima della data di fine";
    private const string InvalidStartDateMessage = "La data di inizio deve essere nel presente o nel futuro";
    private const string InvalidFutureEndDateMessage = "La data di fine deve essere nel futuro";
    private const string InvalidEndDateMessage = "La data di fine deve essere successiva alla data di inizio";
    private const string InvalidEventTypeMessage = "La tipologia evento deve essere partita o evento";

    public async Task<EventResponse> CreateAsync(EventRequest request, CancellationToken cancellationToken)
    {
        var item = new Event();
        ApplyRequest(item, request);
        db.Events.Add(item);
        await db.SaveChangesAsync(cancellationToken);
        return await ToResponseAsync(item, cancellationToken);
    }

    public async Task<IReadOnlyList<EventResponse>> ListAsync(string? tipo, CancellationToken cancellationToken)
    {
        var normalizedTipo = NormalizeEventTypeFilter(tipo);
        var query = db.Events.AsNoTracking();

        if (normalizedTipo is not null)
        {
            query = query.Where(item => (item.Tipo ?? "evento") == normalizedTipo);
        }

        var events = await query.OrderBy(item => item.Data).ToListAsync(cancellationToken);
        return await ToResponsesAsync(events, cancellationToken);
    }

    public async Task<IReadOnlyList<EventResponse>> GetEventsByDateRangeAsync(
        DateTime start,
        DateTime end,
        string? tipo,
        CancellationToken cancellationToken
    )
    {
        if (start > end)
        {
            throw new BadRequestException(InvalidDateRangeMessage);
        }

        var normalizedTipo = NormalizeEventTypeFilter(tipo);
        var query = db.Events.AsNoTracking().Where(item => item.Data > start && item.Data < end);

        if (normalizedTipo is not null)
        {
            query = query.Where(item => (item.Tipo ?? "evento") == normalizedTipo);
        }

        var events = await query.OrderBy(item => item.Data).ToListAsync(cancellationToken);
        return await ToResponsesAsync(events, cancellationToken);
    }

    public async Task<IReadOnlyList<EventResponse>> GetUpcomingEventsAsync(
        DateTime from,
        string? tipo,
        CancellationToken cancellationToken
    )
    {
        var normalizedTipo = NormalizeEventTypeFilter(tipo);
        var query = db.Events.AsNoTracking().Where(item => item.Data >= from);

        if (normalizedTipo is not null)
        {
            query = query.Where(item => (item.Tipo ?? "evento") == normalizedTipo);
        }

        var events = await query.OrderBy(item => item.Data).ToListAsync(cancellationToken);
        return await ToResponsesAsync(events, cancellationToken);
    }

    public async Task<EventResponse> GetByIdAsync(long id, CancellationToken cancellationToken)
    {
        return await ToResponseAsync(await GetEntityByIdAsync(id, cancellationToken), cancellationToken);
    }

    public async Task<Event> GetEntityByIdAsync(long id, CancellationToken cancellationToken)
    {
        return await db.Events.FindAsync(new object?[] { id }, cancellationToken)
            ?? throw new ResourceNotFoundException(EventNotFoundMessage);
    }

    public async Task<EventResponse> UpdateAsync(long id, EventRequest request, CancellationToken cancellationToken)
    {
        var item = await GetEntityByIdAsync(id, cancellationToken);
        ApplyRequest(item, request);
        await db.SaveChangesAsync(cancellationToken);
        return await ToResponseAsync(item, cancellationToken);
    }

    public async Task DeleteAsync(long id, CancellationToken cancellationToken)
    {
        db.Events.Remove(await GetEntityByIdAsync(id, cancellationToken));
        await db.SaveChangesAsync(cancellationToken);
    }

    private void ApplyRequest(Event item, EventRequest request)
    {
        if (request.Data < DateTime.Now.AddSeconds(-1))
        {
            throw new BadRequestException(InvalidStartDateMessage);
        }

        if (request.DataFine is not null && request.DataFine <= DateTime.Now)
        {
            throw new BadRequestException(InvalidFutureEndDateMessage);
        }

        if (request.DataFine is not null && request.DataFine <= request.Data)
        {
            throw new BadRequestException(InvalidEndDateMessage);
        }

        item.Tipo = NormalizeRequiredEventType(request.Tipo);
        item.Titolo = TextNormalizer.NormalizeRequired(request.Titolo);
        item.Descrizione = TextNormalizer.NormalizeRequired(request.Descrizione);
        item.Data = request.Data;
        item.DataFine = request.DataFine;
        item.Luogo = TextNormalizer.NormalizeRequired(request.Luogo);
        item.MaxPartecipanti = request.MaxPartecipanti;
        item.UnlimitedCapacity = request.UnlimitedCapacity;
        item.Volantino = request.Volantino;
    }

    private async Task<IReadOnlyList<EventResponse>> ToResponsesAsync(
        IReadOnlyCollection<Event> events,
        CancellationToken cancellationToken
    )
    {
        if (events.Count == 0)
        {
            return [];
        }

        var eventIds = events.Select(item => item.Id).ToArray();
        var counts = await db.Bookings
            .AsNoTracking()
            .Where(booking => eventIds.Contains(booking.EventId))
            .GroupBy(booking => booking.EventId)
            .Select(group => new { EventId = group.Key, Count = group.LongCount() })
            .ToDictionaryAsync(item => item.EventId, item => item.Count, cancellationToken);

        return events.Select(item => ToResponse(item, counts.GetValueOrDefault(item.Id))).ToList();
    }

    private async Task<EventResponse> ToResponseAsync(Event item, CancellationToken cancellationToken)
    {
        var registeredParticipants = await db.Bookings
            .AsNoTracking()
            .LongCountAsync(booking => booking.EventId == item.Id, cancellationToken);
        return ToResponse(item, registeredParticipants);
    }

    private static EventResponse ToResponse(Event item, long registeredParticipants)
    {
        return new EventResponse(
            item.Id,
            GetEventTypeOrDefault(item.Tipo),
            item.Titolo,
            item.Descrizione,
            item.Data,
            item.DataFine,
            item.Luogo,
            item.MaxPartecipanti,
            item.UnlimitedCapacity,
            item.Volantino,
            registeredParticipants,
            CalculateAvailableSeats(item, registeredParticipants)
        );
    }

    private static long CalculateAvailableSeats(Event item, long registeredParticipants)
    {
        return item.UnlimitedCapacity ? long.MaxValue : Math.Max(0, item.MaxPartecipanti - registeredParticipants);
    }

    private static string? NormalizeEventTypeFilter(string? tipo)
    {
        var normalized = NormalizeOptionalEventType(tipo);
        return normalized is null ? null : ValidateEventType(normalized);
    }

    private static string NormalizeRequiredEventType(string? tipo)
    {
        return ValidateEventType(NormalizeOptionalEventType(tipo) ?? throw new BadRequestException(InvalidEventTypeMessage));
    }

    private static string GetEventTypeOrDefault(string? tipo)
    {
        return NormalizeOptionalEventType(tipo) == "partita" ? "partita" : "evento";
    }

    private static string? NormalizeOptionalEventType(string? tipo)
    {
        var normalized = tipo?.Trim().ToLowerInvariant();
        return string.IsNullOrWhiteSpace(normalized) ? null : normalized;
    }

    private static string ValidateEventType(string tipo)
    {
        return tipo is "partita" or "evento" ? tipo : throw new BadRequestException(InvalidEventTypeMessage);
    }
}
