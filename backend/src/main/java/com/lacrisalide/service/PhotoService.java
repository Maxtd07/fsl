package com.lacrisalide.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Optional;
import com.lacrisalide.repository.PhotoRepository;
import com.lacrisalide.model.Photo;

@Service
@RequiredArgsConstructor
public class PhotoService {
 private final PhotoRepository repo;

 public Photo create(Photo photo) {
  return repo.save(photo);
 }

 public List<Photo> list() {
  return repo.findAllByOrderByCreatedAtDesc();
 }

 public Optional<Photo> getById(Long id) {
  return repo.findById(id);
 }

 public Photo update(Long id, Photo photoDetails) {
  Photo photo = repo.findById(id).orElseThrow(() -> new RuntimeException("Foto non trovata"));
  photo.setTitolo(photoDetails.getTitolo());
  photo.setDescrizione(photoDetails.getDescrizione());
  photo.setImmagine(photoDetails.getImmagine());
  return repo.save(photo);
 }

 public void delete(Long id) {
  repo.deleteById(id);
 }
}
