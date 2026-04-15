package com.lacrisalide.dto.donation;

public record CreatePaymentResponse(
 String orderId,
 String status,
 String approvalUrl
) {}
