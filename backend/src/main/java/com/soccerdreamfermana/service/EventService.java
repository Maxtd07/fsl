package com.soccerdreamfermana.service;

import com.soccerdreamfermana.dto.event.EventRequest;
import com.soccerdreamfermana.dto.event.EventResponse;
import com.soccerdreamfermana.exception.BadRequestException;
import com.soccerdreamfermana.exception.ResourceNotFoundException;
import com.soccerdreamfermana.model.Event;
import com.soccerdreamfermana.repository.BookingRepository;
import com.soccerdreamfermana.repository.EventRepository;
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
 private static final String INVALID_EVENT_TYPE_MESSAGE = "La tipologia evento deve essere partita o evento";

 private final EventRepository eventRepository;
 private final BookingRepository bookingRepository;

 public EventResponse create(EventRequest request) {
  return toResponse(eventRepository.save(buildEvent(request)));
 }

 public List<EventResponse> list(String tipo) {
  return eventRepository.findAllByTipoOrderByDataAsc(normalizeEventTypeFilter(tipo)).stream().map(this::toResponse).toList();
 }

 public List<EventResponse> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate, String tipo) {
  validateDateRange(startDate, endDate);
  return eventRepository.findByDataIsAfterAndDataIsBeforeOrderByDataAsc(startDate, endDate, normalizeEventTypeFilter(tipo))
   .stream()
   .map(this::toResponse)
   .toList();
 }

 public List<EventResponse> getUpcomingEvents(LocalDateTime fromDate, String tipo) {
  return eventRepository.findByDataGreaterThanEqualOrderByDataAsc(fromDate, normalizeEventTypeFilter(tipo))
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
   getEventTypeOrDefault(event.getTipo()),
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
  event.setTipo(normalizeRequiredEventType(request.tipo()));
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

 private String normalizeEventTypeFilter(String tipo) {
  String normalized = normalizeOptionalEventType(tipo);
  return normalized == null ? null : validateEventType(normalized);
 }

 private String normalizeRequiredEventType(String tipo) {
  String normalized = normalizeOptionalEventType(tipo);
  if (normalized == null) {
   throw new BadRequestException(INVALID_EVENT_TYPE_MESSAGE);
  }

  return validateEventType(normalized);
 }

 private String getEventTypeOrDefault(String tipo) {
  String normalized = normalizeOptionalEventType(tipo);
  return "partita".equals(normalized) ? "partita" : "evento";
 }

 private String normalizeOptionalEventType(String tipo) {
  if (tipo == null) {
   return null;
  }

  String normalized = tipo.trim().toLowerCase();
  return normalized.isBlank() ? null : normalized;
 }

 private String validateEventType(String tipo) {
  if (!"partita".equals(tipo) && !"evento".equals(tipo)) {
   throw new BadRequestException(INVALID_EVENT_TYPE_MESSAGE);
  }

  return tipo;
 }
}

