using System.ComponentModel.DataAnnotations;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Dtos;

public sealed record AuthResponse(string Token, UserResponse User);

public sealed record LoginRequest(
    [property: Required(ErrorMessage = "L'email e obbligatoria")]
    [property: EmailAddress(ErrorMessage = "Inserisci un indirizzo email valido")]
    string Email,

    [property: Required(ErrorMessage = "La password e obbligatoria")]
    string Password
);

public sealed record RegisterRequest(
    [property: Required(ErrorMessage = "Il nome e obbligatorio")]
    [property: MaxLength(120, ErrorMessage = "Il nome non puo superare 120 caratteri")]
    string Nome,

    [property: Required(ErrorMessage = "L'email e obbligatoria")]
    [property: EmailAddress(ErrorMessage = "Inserisci un indirizzo email valido")]
    string Email,

    [property: Required(ErrorMessage = "La password e obbligatoria")]
    [property: MinLength(8, ErrorMessage = "La password deve contenere almeno 8 caratteri")]
    string Password
);

public sealed record UserResponse(long Id, string Nome, string Email, Role Ruolo);
