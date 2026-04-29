package com.soccerdreamfermana.dto.event;

import java.time.LocalDateTime;

public record EventResponse(
 Long id,
 String tipo,
 String titolo,
 String descrizione,
 LocalDateTime data,
 LocalDateTime dataFine,
 String luogo,
 Integer maxPartecipanti,
 boolean unlimitedCapacity,
 String volantino,
 long registeredParticipants,
 long availableSeats
) {}

