package com.soccerdreamfermana.dto.photo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO per la creazione/aggiornamento di una foto
 */
public record PhotoRequest(
    @NotBlank(message = "Il titolo Ã¨ obbligatorio")
    @Size(min = 1, max = 180, message = "Il titolo deve essere tra 1 e 180 caratteri")
    String titolo,
    
    @Size(max = 3000, message = "La descrizione non puÃ² superare 3000 caratteri")
    String descrizione,
    
    @NotBlank(message = "L'immagine Ã¨ obbligatoria")
    String immagine) {}

