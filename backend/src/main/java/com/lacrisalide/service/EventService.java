
package com.lacrisalide.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.lacrisalide.repository.EventRepository;
import com.lacrisalide.model.Event;

@Service
@RequiredArgsConstructor
public class EventService {
 private final EventRepository repo;

 public Event create(Event e){ return repo.save(e); }
 public List<Event> list(){ return repo.findAll(); }
}
