package com.soccerdreamfermana.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
 @NotBlank(message = "Il nome è obbligatorio")
 @Size(max = 120, message = "Il nome non può superare 120 caratteri")
 String nome,

 @NotBlank(message = "L'email è obbligatoria")
 @Email(message = "Inserisci un indirizzo email valido")
 String email,

 @NotBlank(message = "La password è obbligatoria")
 @Size(min = 8, message = "La password deve contenere almeno 8 caratteri")
 String password
) {}

