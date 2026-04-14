package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.lacrisalide.service.PhotoService;
import com.lacrisalide.model.Photo;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

 private final PhotoService service;

 @PostMapping
 public Photo create(@RequestBody Photo photo) {
  return service.create(photo);
 }

 @GetMapping
 public List<Photo> list() {
  return service.list();
 }

 @GetMapping("/{id}")
 public ResponseEntity<?> getById(@PathVariable Long id) {
  return service.getById(id)
   .map(ResponseEntity::ok)
   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
 }

 @PutMapping("/{id}")
 public Photo update(@PathVariable Long id, @RequestBody Photo photoDetails) {
  return service.update(id, photoDetails);
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<?> delete(@PathVariable Long id) {
  service.delete(id);
  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
 }
}
