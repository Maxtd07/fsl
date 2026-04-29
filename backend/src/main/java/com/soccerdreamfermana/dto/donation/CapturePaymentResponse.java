package com.soccerdreamfermana.dto.donation;

public record CapturePaymentResponse(
 String orderId,
 String status,
 String payerId,
 String captureId
) {}

