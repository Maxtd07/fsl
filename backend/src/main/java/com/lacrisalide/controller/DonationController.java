package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.lacrisalide.service.DonationService;
import com.lacrisalide.model.Donation;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

 private final DonationService service;

 @PostMapping
 public Donation create(@RequestBody Donation donation) {
  return service.create(donation);
 }

 @GetMapping
 public List<Donation> list() {
  return service.list();
 }

 @GetMapping("/{id}")
 public ResponseEntity<?> getById(@PathVariable Long id) {
  return service.getById(id)
   .map(ResponseEntity::ok)
   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<?> delete(@PathVariable Long id) {
  service.delete(id);
  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 }
}
