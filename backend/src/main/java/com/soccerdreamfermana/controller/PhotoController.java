package com.soccerdreamfermana.controller;

import com.soccerdreamfermana.dto.photo.PhotoRequest;
import com.soccerdreamfermana.dto.photo.PhotoResponse;
import com.soccerdreamfermana.service.PhotoService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

  private final PhotoService service;

  @PostMapping
  public ResponseEntity<PhotoResponse> create(@Valid @RequestBody PhotoRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
  }

  @GetMapping
  public ResponseEntity<List<PhotoResponse>> list() {
    return ResponseEntity.ok(service.list());
  }

  @GetMapping("/{id}")
  public ResponseEntity<PhotoResponse> getById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getById(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<PhotoResponse> update(
      @PathVariable Long id, @Valid @RequestBody PhotoRequest request) {
    return ResponseEntity.ok(service.update(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}


