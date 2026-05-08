using System.ComponentModel.DataAnnotations;

namespace SoccerDreamFermana.Backend.Dtos;

public sealed record MemberRequest(
    [Required(ErrorMessage = "Il nome e obbligatorio")]
    [MaxLength(180, ErrorMessage = "Il nome non puo superare 180 caratteri")]
    string Name,

    [Required(ErrorMessage = "Il ruolo e obbligatorio")]
    [MaxLength(180, ErrorMessage = "Il ruolo non puo superare 180 caratteri")]
    string Role,

    [MaxLength(40, ErrorMessage = "La posizione non puo superare 40 caratteri")]
    string? Position,

    [Range(1, int.MaxValue, ErrorMessage = "Il numero di maglia deve essere almeno 1")]
    int? ShirtNumber,

    string? ImageUrl
);

public sealed record MemberResponse(long Id, string Name, string Role, string? Position, int? ShirtNumber, string? ImageUrl);
