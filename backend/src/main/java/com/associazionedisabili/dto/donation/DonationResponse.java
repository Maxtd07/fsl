package com.associazionedisabili.dto.donation;

import java.time.LocalDateTime;

public record DonationResponse(
 Long id,
 String nome,
 String email,
 Double importo,
 String paypalOrderId,
 String payerId,
 String captureId,
 String paymentStatus,
 LocalDateTime createdAt
) {}
