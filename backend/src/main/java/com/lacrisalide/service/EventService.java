
package com.lacrisalide.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Optional;
import com.lacrisalide.repository.EventRepository;
import com.lacrisalide.model.Event;

@Service
@RequiredArgsConstructor
public class EventService {
 private final EventRepository repo;

 public Event create(Event e){ return repo.save(e); }
 public List<Event> list(){ return repo.findAll(); }
 public Optional<Event> getById(Long id){ return repo.findById(id); }
 public Event update(Long id, Event eventDetails){
  Event event = repo.findById(id).orElseThrow(() -> new RuntimeException("Evento non trovato"));
  event.setTitolo(eventDetails.getTitolo());
  event.setDescrizione(eventDetails.getDescrizione());
  event.setData(eventDetails.getData());
  event.setLuogo(eventDetails.getLuogo());
  event.setMaxPartecipanti(eventDetails.getMaxPartecipanti());
  event.setVolantino(eventDetails.getVolantino());
  return repo.save(event);
 }
 public void delete(Long id){ repo.deleteById(id); }
}
