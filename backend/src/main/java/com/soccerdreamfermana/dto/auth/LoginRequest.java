package com.soccerdreamfermana.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
 @NotBlank(message = "L'email Ã¨ obbligatoria")
 @Email(message = "Inserisci un indirizzo email valido")
 String email,

 @NotBlank(message = "La password Ã¨ obbligatoria")
 String password
) {}

