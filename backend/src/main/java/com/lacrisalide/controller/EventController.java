
package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.lacrisalide.service.EventService;
import com.lacrisalide.model.Event;

@RestController
@RequestMapping("/api/events")
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

 @GetMapping("/{id}")
 public ResponseEntity<?> getById(@PathVariable Long id){
  return service.getById(id)
   .map(ResponseEntity::ok)
   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
 }

 @PutMapping("/{id}")
 public Event update(@PathVariable Long id, @RequestBody Event eventDetails){
  return service.update(id, eventDetails);
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<?> delete(@PathVariable Long id){
  service.delete(id);
  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 }
}
