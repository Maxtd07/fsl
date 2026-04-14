package com.lacrisalide.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.lacrisalide.repository.BookingRepository;
import com.lacrisalide.repository.EventRepository;
import com.lacrisalide.repository.UserRepository;
import com.lacrisalide.model.Booking;
import com.lacrisalide.model.Event;
import com.lacrisalide.model.User;

@Service
@RequiredArgsConstructor
public class BookingService {
 private final BookingRepository bookingRepo;
 private final EventRepository eventRepo;
 private final UserRepository userRepo;

 public Booking create(Long eventId, Long userId) {
  Event event = eventRepo.findById(eventId).orElseThrow(() -> new RuntimeException("Evento non trovato"));
  User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("Utente non trovato"));
  
  Booking booking = new Booking();
  booking.setEvent(event);
  booking.setUser(user);
  return bookingRepo.save(booking);
 }

 public List<Booking> getByEvent(Long eventId) {
  return bookingRepo.findByEventId(eventId);
 }

 public List<Booking> getByUser(Long userId) {
  return bookingRepo.findByUserId(userId);
 }

 public void delete(Long id) {
  bookingRepo.deleteById(id);
 }
}
