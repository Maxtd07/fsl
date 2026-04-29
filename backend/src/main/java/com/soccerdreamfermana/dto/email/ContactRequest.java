package com.soccerdreamfermana.dto.email;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
 @NotBlank(message = "Il nome è obbligatorio")
 @Size(max = 120, message = "Il nome non può superare 120 caratteri")
 String nome,

 @NotBlank(message = "L'email è obbligatoria")
 @Email(message = "Inserisci un indirizzo email valido")
 String email,

 @NotBlank(message = "Il messaggio è obbligatorio")
 @Size(max = 5000, message = "Il messaggio non può superare 5000 caratteri")
 String messaggio
) {}

