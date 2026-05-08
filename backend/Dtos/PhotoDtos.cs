using System.ComponentModel.DataAnnotations;

namespace SoccerDreamFermana.Backend.Dtos;

public sealed record PhotoRequest(
    [property: Required(ErrorMessage = "Il titolo e obbligatorio")]
    [property: StringLength(180, MinimumLength = 1, ErrorMessage = "Il titolo deve essere tra 1 e 180 caratteri")]
    string Titolo,

    [property: MaxLength(3000, ErrorMessage = "La descrizione non puo superare 3000 caratteri")]
    string? Descrizione,

    [property: Required(ErrorMessage = "L'immagine e obbligatoria")]
    string Immagine
);

public sealed record PhotoResponse(long Id, string? Titolo, string? Descrizione, string? Immagine, DateTime CreatedAt);
