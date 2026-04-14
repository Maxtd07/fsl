package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import com.lacrisalide.service.BookingService;
import com.lacrisalide.model.Booking;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

 private final BookingService service;

 // Crea una nuova iscrizione
 @PostMapping("/{eventId}/users/{userId}")
 public ResponseEntity<?> create(@PathVariable Long eventId, @PathVariable Long userId) {
  try {
   Booking booking = service.create(eventId, userId);
   return ResponseEntity.ok(booking);
  } catch (Exception e) {
   log.error("Errore creazione booking: ", e);
   return ResponseEntity.badRequest().body("Errore: " + e.getMessage());
  }
 }

 // Ottieni tutte le iscrizioni per un evento
 @GetMapping("/event/{eventId}")
 public List<Booking> getByEvent(@PathVariable Long eventId) {
  return service.getByEvent(eventId);
 }

 // Ottieni tutte le iscrizioni di un utente
 @GetMapping("/user/{userId}")
 public List<Booking> getByUser(@PathVariable Long userId) {
  return service.getByUser(userId);
 }

 // Elimina iscrizione
 @DeleteMapping("/{id}")
 public ResponseEntity<?> delete(@PathVariable Long id) {
  service.delete(id);
  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 }
}
