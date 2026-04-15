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

 private final DonationRepository donationRepository;
 private final PaymentAdapter paymentAdapter;

 public CreatePaymentResponse createPayment(CreatePaymentRequest request) {
  return paymentAdapter.createPayment(request);
 }

 public CapturePaymentResponse capturePayment(String orderId) {
  return paymentAdapter.capturePayment(orderId);
 }

 public DonationResponse create(DonationRequest request) {
  if (request.paymentStatus() != null && !"COMPLETED".equalsIgnoreCase(request.paymentStatus())) {
   throw new BadRequestException("La donazione può essere salvata solo dopo una cattura completata");
  }

  Donation donation = donationRepository.save(
   Donation.builder()
    .nome(request.nome().trim())
    .email(request.email().trim().toLowerCase())
    .importo(request.importo())
    .paypalOrderId(request.paypalOrderId())
    .payerId(request.payerId())
    .captureId(request.captureId())
    .paymentStatus(request.paymentStatus() == null ? "COMPLETED" : request.paymentStatus())
    .build()
  );

  return toResponse(donation);
 }

 public List<DonationResponse> list() {
  return donationRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
 }

 public DonationResponse getById(Long id) {
  Donation donation = donationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Donazione non trovata"));
  return toResponse(donation);
 }

 public void delete(Long id) {
  Donation donation = donationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Donazione non trovata"));
  donationRepository.delete(donation);
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
}
