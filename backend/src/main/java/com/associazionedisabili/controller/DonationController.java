package com.associazionedisabili.controller;

import com.associazionedisabili.dto.donation.CapturePaymentRequest;
import com.associazionedisabili.dto.donation.CapturePaymentResponse;
import com.associazionedisabili.dto.donation.CreatePaymentRequest;
import com.associazionedisabili.dto.donation.CreatePaymentResponse;
import com.associazionedisabili.dto.donation.DonationRequest;
import com.associazionedisabili.dto.donation.DonationResponse;
import com.associazionedisabili.service.DonationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

 private final DonationService service;

 @PostMapping("/create-payment")
 public ResponseEntity<CreatePaymentResponse> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
  return ResponseEntity.ok(service.createPayment(request));
 }

 @PostMapping("/capture-payment")
 public ResponseEntity<CapturePaymentResponse> capturePayment(@Valid @RequestBody CapturePaymentRequest request) {
  return ResponseEntity.ok(service.capturePayment(request.orderId()));
 }

 @PostMapping
 public DonationResponse create(@Valid @RequestBody DonationRequest request) {
  return service.create(request);
 }

 @GetMapping
 public List<DonationResponse> list() {
  return service.list();
 }

 @GetMapping("/{id}")
 public DonationResponse getById(@PathVariable Long id) {
  return service.getById(id);
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> delete(@PathVariable Long id) {
  service.delete(id);
  return ResponseEntity.noContent().build();
 }
}
