package com.lacrisalide.service;

import com.lacrisalide.dto.event.EventRequest;
import com.lacrisalide.dto.event.EventResponse;
import com.lacrisalide.exception.BadRequestException;
import com.lacrisalide.exception.ResourceNotFoundException;
import com.lacrisalide.model.Event;
import com.lacrisalide.repository.BookingRepository;
import com.lacrisalide.repository.EventRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

 private final EventRepository eventRepository;
 private final BookingRepository bookingRepository;

 public EventResponse create(EventRequest request) {
  return toResponse(eventRepository.save(toEntity(request)));
 }

 public List<EventResponse> list() {
  return eventRepository.findAllByOrderByDataAsc().stream().map(this::toResponse).toList();
 }

 public EventResponse getById(Long id) {
  return toResponse(getEntityById(id));
 }

 public Event getEntityById(Long id) {
  return eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Evento non trovato"));
 }

 public EventResponse update(Long id, EventRequest request) {
  Event event = getEntityById(id);
  validateDates(request);
  event.setTitolo(request.titolo().trim());
  event.setDescrizione(request.descrizione().trim());
  event.setData(request.data());
  event.setDataFine(request.dataFine());
  event.setLuogo(request.luogo().trim());
  event.setMaxPartecipanti(request.maxPartecipanti());
  event.setVolantino(request.volantino());
  return toResponse(eventRepository.save(event));
 }

 public void delete(Long id) {
  eventRepository.delete(getEntityById(id));
 }

 public EventResponse toResponse(Event event) {
  long registeredParticipants = bookingRepository.countByEventId(event.getId());
  long availableSeats = Math.max(0, event.getMaxPartecipanti() - registeredParticipants);
  return new EventResponse(
   event.getId(),
   event.getTitolo(),
   event.getDescrizione(),
   event.getData(),
   event.getDataFine(),
   event.getLuogo(),
   event.getMaxPartecipanti(),
   event.getVolantino(),
   registeredParticipants,
   availableSeats
  );
 }

 private Event toEntity(EventRequest request) {
  validateDates(request);
  return Event.builder()
   .titolo(request.titolo().trim())
   .descrizione(request.descrizione().trim())
   .data(request.data())
   .dataFine(request.dataFine())
   .luogo(request.luogo().trim())
   .maxPartecipanti(request.maxPartecipanti())
   .volantino(request.volantino())
   .build();
 }

 private void validateDates(EventRequest request) {
  if (request.dataFine() != null && !request.dataFine().isAfter(request.data())) {
   throw new BadRequestException("La data di fine deve essere successiva alla data di inizio");
  }
 }
}
