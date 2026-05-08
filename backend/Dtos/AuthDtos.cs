using System.ComponentModel.DataAnnotations;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Dtos;

public sealed record AuthResponse(string Token, UserResponse User);

public sealed record LoginRequest(
    [Required(ErrorMessage = "L'email e obbligatoria")]
    [EmailAddress(ErrorMessage = "Inserisci un indirizzo email valido")]
    string Email,

    [Required(ErrorMessage = "La password e obbligatoria")]
    string Password
);

public sealed record RegisterRequest(
    [Required(ErrorMessage = "Il nome e obbligatorio")]
    [MaxLength(120, ErrorMessage = "Il nome non puo superare 120 caratteri")]
    string Nome,

    [Required(ErrorMessage = "L'email e obbligatoria")]
    [EmailAddress(ErrorMessage = "Inserisci un indirizzo email valido")]
    string Email,

    [Required(ErrorMessage = "La password e obbligatoria")]
    [MinLength(8, ErrorMessage = "La password deve contenere almeno 8 caratteri")]
    string Password
);

public sealed record UserResponse(long Id, string Nome, string Email, Role Ruolo);
