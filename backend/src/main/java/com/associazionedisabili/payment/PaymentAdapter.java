package com.associazionedisabili.payment;

import com.associazionedisabili.dto.donation.CapturePaymentResponse;
import com.associazionedisabili.dto.donation.CreatePaymentRequest;
import com.associazionedisabili.dto.donation.CreatePaymentResponse;

public interface PaymentAdapter {
 CreatePaymentResponse createPayment(CreatePaymentRequest request);
 CapturePaymentResponse capturePayment(String orderId);
}
