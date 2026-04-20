package com.soccerdreamfermana.service;

import com.soccerdreamfermana.dto.booking.BookingResponse;
import com.soccerdreamfermana.exception.BadRequestException;
import com.soccerdreamfermana.exception.ResourceNotFoundException;
import com.soccerdreamfermana.model.Booking;
import com.soccerdreamfermana.model.Event;
import com.soccerdreamfermana.model.User;
import com.soccerdreamfermana.repository.BookingRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingService {

 private static final String BOOKING_NOT_FOUND_MESSAGE = "Iscrizione non trovata";
 private static final String ALREADY_BOOKED_MESSAGE = "Sei giÃƒÂ  iscritto a questo evento";
 private static final String EVENT_FULL_MESSAGE = "L'evento ÃƒÂ¨ al completo";

 private final BookingRepository bookingRepository;
 private final EventService eventService;
 private final UserService userService;
 private final EmailService emailService;

 public BookingResponse create(Long eventId, Long userId) {
  Event event = eventService.getEntityById(eventId);
  User user = userService.findById(userId);
  validateBookingAvailability(eventId, event, userId);

  Booking booking = bookingRepository.save(buildBooking(event, user));
  return toResponse(booking, emailService.sendBookingConfirmation(user, event));
 }

 public List<BookingResponse> getByUser(Long userId) {
  return toResponses(bookingRepository.findByUserIdOrderByCreatedAtDesc(userId));
 }

 public List<BookingResponse> getByEvent(Long eventId) {
  eventService.getEntityById(eventId);
  return toResponses(bookingRepository.findByEventIdOrderByCreatedAtDesc(eventId));
 }

 public void delete(Long id) {
  bookingRepository.delete(findBookingById(id));
 }

 private void validateBookingAvailability(Long eventId, Event event, Long userId) {
  if (bookingRepository.existsByUserIdAndEventId(userId, eventId)) {
   throw new BadRequestException(ALREADY_BOOKED_MESSAGE);
  }

  if (!event.isUnlimitedCapacity() && bookingRepository.countByEventId(eventId) >= event.getMaxPartecipanti()) {
   throw new BadRequestException(EVENT_FULL_MESSAGE);
  }
 }

 private Booking buildBooking(Event event, User user) {
  return Booking.builder()
   .event(event)
   .user(user)
   .build();
 }

 private Booking findBookingById(Long id) {
  return bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(BOOKING_NOT_FOUND_MESSAGE));
 }

 private List<BookingResponse> toResponses(List<Booking> bookings) {
  return bookings.stream()
   .map(booking -> toResponse(booking, false))
   .toList();
 }

 private BookingResponse toResponse(Booking booking, boolean emailSent) {
  return new BookingResponse(
   booking.getId(),
   booking.getEvent().getId(),
   normalizeEventType(booking.getEvent().getTipo()),
   booking.getEvent().getTitolo(),
   booking.getEvent().getData(),
   booking.getEvent().getLuogo(),
   booking.getUser().getId(),
   booking.getUser().getNome(),
   booking.getUser().getEmail(),
   booking.getCreatedAt(),
   emailSent,
   buildCalendarLink(booking)
  );
 }

 private String buildCalendarLink(Booking booking) {
  return "/api/events/" + booking.getEvent().getId() + "/calendar";
 }

 private String normalizeEventType(String value) {
  String normalized = value == null ? null : value.trim().toLowerCase();
  return "partita".equals(normalized) ? "partita" : "evento";
 }
}

