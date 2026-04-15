package com.lacrisalide.controller;

import com.lacrisalide.dto.event.EventRequest;
import com.lacrisalide.dto.event.EventResponse;
import com.lacrisalide.model.Event;
import com.lacrisalide.service.CalendarInviteService;
import com.lacrisalide.service.EventService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

 private final EventService service;
 private final CalendarInviteService calendarInviteService;

 @PostMapping
 public ResponseEntity<EventResponse> create(@Valid @RequestBody EventRequest request) {
  return ResponseEntity.ok(service.create(request));
 }

 @GetMapping
 public List<EventResponse> list() {
  return service.list();
 }

 @GetMapping("/{id}")
 public EventResponse getById(@PathVariable Long id) {
  return service.getById(id);
 }

 @PutMapping("/{id}")
 public EventResponse update(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
  return service.update(id, request);
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> delete(@PathVariable Long id) {
  service.delete(id);
  return ResponseEntity.noContent().build();
 }

 @GetMapping("/{id}/calendar")
 public ResponseEntity<ByteArrayResource> downloadCalendar(@PathVariable Long id) {
  Event event = service.getEntityById(id);
  ByteArrayResource resource = new ByteArrayResource(calendarInviteService.buildEventInvite(event));
  return ResponseEntity.ok()
   .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + calendarInviteService.buildFileName(event) + "\"")
   .contentType(MediaType.parseMediaType("text/calendar"))
   .body(resource);
 }
}
