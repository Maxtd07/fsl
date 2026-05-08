using System.ComponentModel.DataAnnotations;

namespace SoccerDreamFermana.Backend.Dtos;

public sealed record ContactRequest(
    [property: Required(ErrorMessage = "Il nome e obbligatorio")]
    [property: MaxLength(120, ErrorMessage = "Il nome non puo superare 120 caratteri")]
    string Nome,

    [property: Required(ErrorMessage = "L'email e obbligatoria")]
    [property: EmailAddress(ErrorMessage = "Inserisci un indirizzo email valido")]
    string Email,

    [property: Required(ErrorMessage = "Il messaggio e obbligatorio")]
    [property: MaxLength(5000, ErrorMessage = "Il messaggio non puo superare 5000 caratteri")]
    string Messaggio
);

public sealed record FacebookPostResponse(
    string? Id,
    string? Message,
    string? FullPicture,
    string? CreatedTime,
    string? PermalinkUrl,
    long LikesCount,
    long CommentsCount
);
