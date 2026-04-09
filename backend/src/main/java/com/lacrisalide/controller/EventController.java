
package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.lacrisalide.service.EventService;
import com.lacrisalide.model.Event;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

 private final EventService eventService;

 @PostMapping
 public Event create(@RequestBody Event e){
  return eventService.create(e);
 }

 @GetMapping
 public List<Event> list(){
  return eventService.list();
 }

}
