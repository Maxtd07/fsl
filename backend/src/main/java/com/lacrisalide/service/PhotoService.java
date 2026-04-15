package com.lacrisalide.service;

import com.lacrisalide.model.Photo;
import com.lacrisalide.repository.PhotoRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PhotoService {

 private static final String PHOTO_NOT_FOUND_MESSAGE = "Foto non trovata";

 private final PhotoRepository photoRepository;

 public Photo create(Photo photo) {
  return photoRepository.save(photo);
 }

 public List<Photo> list() {
  return photoRepository.findAllByOrderByCreatedAtDesc();
 }

 public Optional<Photo> getById(Long id) {
  return photoRepository.findById(id);
 }

 public Photo update(Long id, Photo photoDetails) {
  Photo photo = findPhotoById(id);
  applyPhotoDetails(photo, photoDetails);
  return photoRepository.save(photo);
 }

 public void delete(Long id) {
  photoRepository.deleteById(id);
 }

 private Photo findPhotoById(Long id) {
  return photoRepository.findById(id).orElseThrow(() -> new RuntimeException(PHOTO_NOT_FOUND_MESSAGE));
 }

 private void applyPhotoDetails(Photo photo, Photo photoDetails) {
  photo.setTitolo(photoDetails.getTitolo());
  photo.setDescrizione(photoDetails.getDescrizione());
  photo.setImmagine(photoDetails.getImmagine());
 }
}
