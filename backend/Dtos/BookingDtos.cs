using System.ComponentModel.DataAnnotations;

namespace SoccerDreamFermana.Backend.Dtos;

public sealed record BookingRequest(
    [Required(ErrorMessage = "L'id dell'evento e obbligatorio")]
    long EventId
);

public sealed record BookingResponse(
    long Id,
    long EventId,
    string EventType,
    string EventTitle,
    DateTime EventDate,
    string Location,
    long UserId,
    string UserName,
    string UserEmail,
    DateTime CreatedAt,
    bool EmailSent,
    string CalendarUrl
);
