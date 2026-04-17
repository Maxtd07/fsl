package com.associazionedisabili.service;

import com.associazionedisabili.dto.event.EventRequest;
import com.associazionedisabili.dto.event.EventResponse;
import com.associazionedisabili.exception.BadRequestException;
import com.associazionedisabili.exception.ResourceNotFoundException;
import com.associazionedisabili.model.Event;
import com.associazionedisabili.repository.BookingRepository;
import com.associazionedisabili.repository.EventRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

 private static final String EVENT_NOT_FOUND_MESSAGE = "Evento non trovato";
 private static final String INVALID_DATE_RANGE_MESSAGE = "La data di inizio deve essere prima della data di fine";
 private static final String INVALID_END_DATE_MESSAGE = "La data di fine deve essere successiva alla data di inizio";

 private final EventRepository eventRepository;
 private final BookingRepository bookingRepository;

 public EventResponse create(EventRequest request) {
  return toResponse(eventRepository.save(buildEvent(request)));
 }

 public List<EventResponse> list() {
  return eventRepository.findAllByOrderByDataAsc().stream().map(this::toResponse).toList();
 }

 public List<EventResponse> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
  validateDateRange(startDate, endDate);
  return eventRepository.findByDataIsAfterAndDataIsBeforeOrderByDataAsc(startDate, endDate)
   .stream()
   .map(this::toResponse)
   .toList();
 }

 public List<EventResponse> getUpcomingEvents(LocalDateTime fromDate) {
  return eventRepository.findByDataGreaterThanEqualOrderByDataAsc(fromDate)
   .stream()
   .map(this::toResponse)
   .toList();
 }

 public EventResponse getById(Long id) {
  return toResponse(getEntityById(id));
 }

 public Event getEntityById(Long id) {
  return eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(EVENT_NOT_FOUND_MESSAGE));
 }

 public EventResponse update(Long id, EventRequest request) {
  Event event = getEntityById(id);
  applyRequest(event, request);
  return toResponse(eventRepository.save(event));
 }

 public void delete(Long id) {
  eventRepository.delete(getEntityById(id));
 }

 public EventResponse toResponse(Event event) {
  long registeredParticipants = bookingRepository.countByEventId(event.getId());
  return new EventResponse(
   event.getId(),
   event.getTitolo(),
   event.getDescrizione(),
   event.getData(),
  event.getDataFine(),
  event.getLuogo(),
  event.getMaxPartecipanti(),
   event.isUnlimitedCapacity(),
  event.getVolantino(),
  registeredParticipants,
  calculateAvailableSeats(event, registeredParticipants)
  );
 }

 private Event buildEvent(EventRequest request) {
  Event event = new Event();
  applyRequest(event, request);
  return event;
 }

 private void applyRequest(Event event, EventRequest request) {
  validateDates(request);
  event.setTitolo(request.titolo().trim());
  event.setDescrizione(request.descrizione().trim());
  event.setData(request.data());
  event.setDataFine(request.dataFine());
  event.setLuogo(request.luogo().trim());
  event.setMaxPartecipanti(request.maxPartecipanti());
  event.setUnlimitedCapacity(request.unlimitedCapacity());
  event.setVolantino(request.volantino());
 }

 private void validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
  if (startDate.isAfter(endDate)) {
   throw new BadRequestException(INVALID_DATE_RANGE_MESSAGE);
  }
 }

 private void validateDates(EventRequest request) {
  if (request.dataFine() != null && !request.dataFine().isAfter(request.data())) {
   throw new BadRequestException(INVALID_END_DATE_MESSAGE);
  }
 }

 private long calculateAvailableSeats(Event event, long registeredParticipants) {
  if (event.isUnlimitedCapacity()) {
   return Long.MAX_VALUE;
  }

  return Math.max(0, event.getMaxPartecipanti() - registeredParticipants);
 }
}
