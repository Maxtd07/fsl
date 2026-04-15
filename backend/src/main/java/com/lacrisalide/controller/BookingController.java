package com.lacrisalide.controller;

import com.lacrisalide.dto.booking.BookingRequest;
import com.lacrisalide.dto.booking.BookingResponse;
import com.lacrisalide.security.AppUserPrincipal;
import com.lacrisalide.service.BookingService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

 private final BookingService service;

 @PostMapping
 public ResponseEntity<BookingResponse> create(
  @Valid @RequestBody BookingRequest request,
  @AuthenticationPrincipal AppUserPrincipal principal
 ) {
  return ResponseEntity.ok(service.create(request.eventId(), principal.getId()));
 }

 @GetMapping("/my")
 public List<BookingResponse> getMyBookings(@AuthenticationPrincipal AppUserPrincipal principal) {
  return service.getByUser(principal.getId());
 }

 @GetMapping("/event/{eventId}")
 public List<BookingResponse> getByEvent(@PathVariable Long eventId) {
  return service.getByEvent(eventId);
 }

 @GetMapping("/user/{userId}")
 public List<BookingResponse> getByUser(@PathVariable Long userId) {
  return service.getByUser(userId);
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> delete(@PathVariable Long id) {
  service.delete(id);
  return ResponseEntity.noContent().build();
 }
}
