package com.soccerdreamfermana.service;

import com.soccerdreamfermana.dto.donation.CapturePaymentResponse;
import com.soccerdreamfermana.dto.donation.CreatePaymentRequest;
import com.soccerdreamfermana.dto.donation.CreatePaymentResponse;
import com.soccerdreamfermana.dto.donation.DonationRequest;
import com.soccerdreamfermana.dto.donation.DonationResponse;
import com.soccerdreamfermana.exception.BadRequestException;
import com.soccerdreamfermana.exception.ResourceNotFoundException;
import com.soccerdreamfermana.model.Donation;
import com.soccerdreamfermana.payment.PaymentAdapter;
import com.soccerdreamfermana.repository.DonationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DonationService {

 private static final String DONATION_NOT_FOUND_MESSAGE = "Donazione non trovata";
 private static final String INVALID_PAYMENT_STATUS_MESSAGE = "La donazione può essere salvata solo dopo una cattura completata";
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

