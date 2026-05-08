using System.ComponentModel.DataAnnotations;

namespace SoccerDreamFermana.Backend.Dtos;

public sealed record ContactRequest(
    [Required(ErrorMessage = "Il nome e obbligatorio")]
    [MaxLength(120, ErrorMessage = "Il nome non puo superare 120 caratteri")]
    string Nome,

    [Required(ErrorMessage = "L'email e obbligatoria")]
    [EmailAddress(ErrorMessage = "Inserisci un indirizzo email valido")]
    string Email,

    [Required(ErrorMessage = "Il messaggio e obbligatorio")]
    [MaxLength(5000, ErrorMessage = "Il messaggio non puo superare 5000 caratteri")]
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
