package com.soccerdreamfermana.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
 @NotBlank(message = "Il nome Ã¨ obbligatorio")
 @Size(max = 120, message = "Il nome non puÃ² superare 120 caratteri")
 String nome,

 @NotBlank(message = "L'email Ã¨ obbligatoria")
 @Email(message = "Inserisci un indirizzo email valido")
 String email,

 @NotBlank(message = "La password Ã¨ obbligatoria")
 @Size(min = 8, message = "La password deve contenere almeno 8 caratteri")
 String password
) {}

