
package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.lacrisalide.service.EventService;
import com.lacrisalide.model.Event;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

 private final EventService service;

 @PostMapping
 public Event create(@RequestBody Event e){
  return service.create(e);
 }

 @GetMapping
 public List<Event> list(){
  return service.list();
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<?> delete(@PathVariable Long id){
  service.delete(id);
  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 }
}
