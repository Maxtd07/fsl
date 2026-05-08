using System.ComponentModel.DataAnnotations;

namespace SoccerDreamFermana.Backend.Dtos;

public sealed record EventRequest(
    [Required(ErrorMessage = "La tipologia e obbligatoria")]
    [MaxLength(40, ErrorMessage = "La tipologia non puo superare 40 caratteri")]
    string Tipo,

    [Required(ErrorMessage = "Il titolo e obbligatorio")]
    [MaxLength(180, ErrorMessage = "Il titolo non puo superare 180 caratteri")]
    string Titolo,

    [Required(ErrorMessage = "La descrizione e obbligatoria")]
    [MaxLength(3000, ErrorMessage = "La descrizione non puo superare 3000 caratteri")]
    string Descrizione,

    [Required(ErrorMessage = "La data di inizio e obbligatoria")]
    DateTime Data,

    DateTime? DataFine,

    [Required(ErrorMessage = "Il luogo e obbligatorio")]
    [MaxLength(240, ErrorMessage = "Il luogo non puo superare 240 caratteri")]
    string Luogo,

    [Range(1, int.MaxValue, ErrorMessage = "Il numero massimo di partecipanti deve essere almeno 1")]
    int MaxPartecipanti,

    bool UnlimitedCapacity,
    string? Volantino
);

public sealed record EventResponse(
    long Id,
    string Tipo,
    string Titolo,
    string Descrizione,
    DateTime Data,
    DateTime? DataFine,
    string Luogo,
    int MaxPartecipanti,
    bool UnlimitedCapacity,
    string? Volantino,
    long RegisteredParticipants,
    long AvailableSeats
);
