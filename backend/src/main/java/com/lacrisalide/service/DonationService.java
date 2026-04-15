package com.lacrisalide.service;

import com.lacrisalide.dto.donation.CapturePaymentResponse;
import com.lacrisalide.dto.donation.CreatePaymentRequest;
import com.lacrisalide.dto.donation.CreatePaymentResponse;
import com.lacrisalide.dto.donation.DonationRequest;
import com.lacrisalide.dto.donation.DonationResponse;
import com.lacrisalide.exception.BadRequestException;
import com.lacrisalide.exception.ResourceNotFoundException;
import com.lacrisalide.model.Donation;
import com.lacrisalide.payment.PaymentAdapter;
import com.lacrisalide.repository.DonationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DonationService {

 private static final String DONATION_NOT_FOUND_MESSAGE = "Donazione non trovata";
 private static final String INVALID_PAYMENT_STATUS_MESSAGE = "La donazione puÃ² essere salvata solo dopo una cattura completata";
 private static final String COMPLETED_PAYMENT_STATUS = "COMPLETED";

 private final DonationRepository donationRepository;
 private final PaymentAdapter paymentAdapter;

 public CreatePaymentResponse createPayment(CreatePaymentRequest request) {
  return paymentAdapter.createPayment(request);
 }

 public CapturePaymentResponse capturePayment(String orderId) {
  return paymentAdapter.capturePayment(orderId);
 }

 public DonationResponse create(DonationRequest request) {
  validatePaymentStatus(request.paymentStatus());
  return toResponse(donationRepository.save(buildDonation(request)));
 }

 public List<DonationResponse> list() {
  return donationRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
 }

 public DonationResponse getById(Long id) {
  return toResponse(findDonationById(id));
 }

 public void delete(Long id) {
  donationRepository.delete(findDonationById(id));
 }

 private void validatePaymentStatus(String paymentStatus) {
  if (paymentStatus != null && !COMPLETED_PAYMENT_STATUS.equalsIgnoreCase(paymentStatus)) {
   throw new BadRequestException(INVALID_PAYMENT_STATUS_MESSAGE);
  }
 }

 private Donation buildDonation(DonationRequest request) {
  return Donation.builder()
   .nome(request.nome().trim())
   .email(normalizeEmail(request.email()))
   .importo(request.importo())
   .paypalOrderId(request.paypalOrderId())
   .payerId(request.payerId())
   .captureId(request.captureId())
   .paymentStatus(resolvePaymentStatus(request.paymentStatus()))
   .build();
 }

 private Donation findDonationById(Long id) {
  return donationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(DONATION_NOT_FOUND_MESSAGE));
 }

 private DonationResponse toResponse(Donation donation) {
  return new DonationResponse(
   donation.getId(),
   donation.getNome(),
   donation.getEmail(),
   donation.getImporto(),
   donation.getPaypalOrderId(),
   donation.getPayerId(),
   donation.getCaptureId(),
   donation.getPaymentStatus(),
   donation.getCreatedAt()
  );
 }

 private String normalizeEmail(String email) {
  return email.trim().toLowerCase();
 }

 private String resolvePaymentStatus(String paymentStatus) {
  return paymentStatus == null ? COMPLETED_PAYMENT_STATUS : paymentStatus;
 }
}
