package com.soccerdreamfermana.payment;

import com.soccerdreamfermana.dto.donation.CapturePaymentResponse;
import com.soccerdreamfermana.dto.donation.CreatePaymentRequest;
import com.soccerdreamfermana.dto.donation.CreatePaymentResponse;

public interface PaymentAdapter {
 CreatePaymentResponse createPayment(CreatePaymentRequest request);
 CapturePaymentResponse capturePayment(String orderId);
}

