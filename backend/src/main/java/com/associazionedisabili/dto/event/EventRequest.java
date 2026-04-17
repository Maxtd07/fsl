package com.associazionedisabili.dto.event;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record EventRequest(
 @NotBlank(message = "La tipologia e obbligatoria")
 @Size(max = 40, message = "La tipologia non puo superare 40 caratteri")
 String tipo,

 @NotBlank(message = "Il titolo e obbligatorio")
 @Size(max = 180, message = "Il titolo non puo superare 180 caratteri")
 String titolo,

 @NotBlank(message = "La descrizione e obbligatoria")
 @Size(max = 3000, message = "La descrizione non puo superare 3000 caratteri")
 String descrizione,

 @NotNull(message = "La data di inizio e obbligatoria")
 @FutureOrPresent(message = "La data di inizio deve essere nel presente o nel futuro")
 LocalDateTime data,

 @Future(message = "La data di fine deve essere nel futuro")
 LocalDateTime dataFine,

 @NotBlank(message = "Il luogo e obbligatorio")
 @Size(max = 240, message = "Il luogo non puo superare 240 caratteri")
 String luogo,

 @NotNull(message = "Il numero massimo di partecipanti e obbligatorio")
 @Min(value = 1, message = "Il numero massimo di partecipanti deve essere almeno 1")
 Integer maxPartecipanti,

 boolean unlimitedCapacity,

 String volantino
) {}
