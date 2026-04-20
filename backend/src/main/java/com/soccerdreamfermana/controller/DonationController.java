package com.soccerdreamfermana.controller;

import com.soccerdreamfermana.dto.donation.CapturePaymentRequest;
import com.soccerdreamfermana.dto.donation.CapturePaymentResponse;
import com.soccerdreamfermana.dto.donation.CreatePaymentRequest;
import com.soccerdreamfermana.dto.donation.CreatePaymentResponse;
import com.soccerdreamfermana.dto.donation.DonationRequest;
import com.soccerdreamfermana.dto.donation.DonationResponse;
import com.soccerdreamfermana.service.DonationService;
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

