package com.lacrisalide.payment;

import com.lacrisalide.dto.donation.CapturePaymentResponse;
import com.lacrisalide.dto.donation.CreatePaymentRequest;
import com.lacrisalide.dto.donation.CreatePaymentResponse;

public interface PaymentAdapter {
 CreatePaymentResponse createPayment(CreatePaymentRequest request);
 CapturePaymentResponse capturePayment(String orderId);
}
