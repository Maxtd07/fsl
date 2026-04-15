package com.lacrisalide.service;

import com.lacrisalide.dto.booking.BookingResponse;
import com.lacrisalide.exception.BadRequestException;
import com.lacrisalide.exception.ResourceNotFoundException;
import com.lacrisalide.model.Booking;
import com.lacrisalide.model.Event;
import com.lacrisalide.model.User;
import com.lacrisalide.repository.BookingRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingService {

 private final BookingRepository bookingRepository;
 private final EventService eventService;
 private final UserService userService;
 private final EmailService emailService;

 public BookingResponse create(Long eventId, Long userId) {
  Event event = eventService.getEntityById(eventId);
  User user = userService.findById(userId);

  if (bookingRepository.existsByUserIdAndEventId(userId, eventId)) {
   throw new BadRequestException("Sei già iscritto a questo evento");
  }

  long currentParticipants = bookingRepository.countByEventId(eventId);
  if (currentParticipants >= event.getMaxPartecipanti()) {
   throw new BadRequestException("L'evento è al completo");
  }

  Booking booking = bookingRepository.save(
   Booking.builder()
    .event(event)
    .user(user)
    .build()
  );

  boolean emailSent = emailService.sendBookingConfirmation(user, event);
  return toResponse(booking, emailSent);
 }

 public List<BookingResponse> getByUser(Long userId) {
  return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
   .map(booking -> toResponse(booking, false))
   .toList();
 }

 public List<BookingResponse> getByEvent(Long eventId) {
  eventService.getEntityById(eventId);
  return bookingRepository.findByEventIdOrderByCreatedAtDesc(eventId).stream()
   .map(booking -> toResponse(booking, false))
   .toList();
 }

 public void delete(Long id) {
  Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Iscrizione non trovata"));
  bookingRepository.delete(booking);
 }

 private BookingResponse toResponse(Booking booking, boolean emailSent) {
  return new BookingResponse(
   booking.getId(),
   booking.getEvent().getId(),
   booking.getEvent().getTitolo(),
   booking.getEvent().getData(),
   booking.getEvent().getLuogo(),
   booking.getUser().getId(),
   booking.getUser().getNome(),
   booking.getUser().getEmail(),
   booking.getCreatedAt(),
   emailSent,
   "/api/events/" + booking.getEvent().getId() + "/calendar"
  );
 }
}
