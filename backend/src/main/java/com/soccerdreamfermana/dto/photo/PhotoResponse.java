package com.soccerdreamfermana.dto.photo;

import java.time.LocalDateTime;

/**
 * DTO per la risposta di una foto
 */
public record PhotoResponse(
    Long id,
    String titolo,
    String descrizione,
    String immagine,
    LocalDateTime createdAt) {}

