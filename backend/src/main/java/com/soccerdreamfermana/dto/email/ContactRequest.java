package com.soccerdreamfermana.dto.email;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
 @NotBlank(message = "Il nome Ã¨ obbligatorio")
 @Size(max = 120, message = "Il nome non puÃ² superare 120 caratteri")
 String nome,

 @NotBlank(message = "L'email Ã¨ obbligatoria")
 @Email(message = "Inserisci un indirizzo email valido")
 String email,

 @NotBlank(message = "Il messaggio Ã¨ obbligatorio")
 @Size(max = 5000, message = "Il messaggio non puÃ² superare 5000 caratteri")
 String messaggio
) {}

