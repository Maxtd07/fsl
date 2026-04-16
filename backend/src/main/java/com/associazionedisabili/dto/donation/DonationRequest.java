package com.associazionedisabili.dto.donation;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DonationRequest(
 @NotBlank(message = "Il nome è obbligatorio")
 @Size(max = 120, message = "Il nome non può superare 120 caratteri")
 String nome,

 @NotBlank(message = "L'email è obbligatoria")
 @Email(message = "Inserisci un indirizzo email valido")
 String email,

 @NotNull(message = "L'importo è obbligatorio")
 @DecimalMin(value = "1.00", message = "L'importo minimo è 1 euro")
 Double importo,

 @NotBlank(message = "L'orderId PayPal è obbligatorio")
 String paypalOrderId,

 String payerId,
 String captureId,
 String paymentStatus
) {}
