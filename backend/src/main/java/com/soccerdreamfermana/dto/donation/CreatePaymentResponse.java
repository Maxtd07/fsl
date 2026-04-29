package com.soccerdreamfermana.dto.donation;

public record CreatePaymentResponse(
 String orderId,
 String status,
 String approvalUrl
) {}

