package com.soccerdreamfermana.dto.donation;

import jakarta.validation.constraints.NotBlank;

public record CapturePaymentRequest(
 @NotBlank(message = "L'orderId Ã¨ obbligatorio")
 String orderId
) {}

