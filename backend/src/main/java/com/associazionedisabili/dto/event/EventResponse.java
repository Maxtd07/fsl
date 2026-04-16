package com.associazionedisabili.dto.event;

import java.time.LocalDateTime;

public record EventResponse(
 Long id,
 String titolo,
 String descrizione,
 LocalDateTime data,
 LocalDateTime dataFine,
 String luogo,
 Integer maxPartecipanti,
 String volantino,
 long registeredParticipants,
 long availableSeats
) {}
