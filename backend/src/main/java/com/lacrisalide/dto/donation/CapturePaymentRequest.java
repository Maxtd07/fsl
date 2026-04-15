package com.lacrisalide.dto.donation;

import jakarta.validation.constraints.NotBlank;

public record CapturePaymentRequest(
 @NotBlank(message = "L'orderId è obbligatorio")
 String orderId
) {}
