package com.associazionedisabili.dto.event;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record EventRequest(
 @NotBlank(message = "Il titolo è obbligatorio")
 @Size(max = 180, message = "Il titolo non può superare 180 caratteri")
 String titolo,

 @NotBlank(message = "La descrizione è obbligatoria")
 @Size(max = 3000, message = "La descrizione non può superare 3000 caratteri")
 String descrizione,

 @NotNull(message = "La data di inizio è obbligatoria")
 @FutureOrPresent(message = "La data di inizio deve essere nel presente o nel futuro")
 LocalDateTime data,

 @Future(message = "La data di fine deve essere nel futuro")
 LocalDateTime dataFine,

 @NotBlank(message = "Il luogo è obbligatorio")
 @Size(max = 240, message = "Il luogo non può superare 240 caratteri")
 String luogo,

 @NotNull(message = "Il numero massimo di partecipanti è obbligatorio")
 @Min(value = 1, message = "Il numero massimo di partecipanti deve essere almeno 1")
 Integer maxPartecipanti,

 String volantino
) {}
