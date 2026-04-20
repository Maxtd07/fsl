package com.soccerdreamfermana.service;

import com.soccerdreamfermana.dto.photo.PhotoRequest;
import com.soccerdreamfermana.dto.photo.PhotoResponse;
import com.soccerdreamfermana.model.Photo;
import com.soccerdreamfermana.repository.PhotoRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PhotoService {

  private static final String PHOTO_NOT_FOUND_MESSAGE = "Foto non trovata";

  private final PhotoRepository photoRepository;
  private final StringNormalizationService normalizationService;

  public PhotoResponse create(PhotoRequest request) {
    Photo photo = new Photo();
    applyRequest(photo, request);
    return toResponse(photoRepository.save(photo));
  }

  public List<PhotoResponse> list() {
    return photoRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
  }

  public PhotoResponse getById(Long id) {
    return toResponse(getEntityById(id));
  }

  public PhotoResponse update(Long id, PhotoRequest request) {
    Photo photo = getEntityById(id);
    applyRequest(photo, request);
    return toResponse(photoRepository.save(photo));
  }

  public void delete(Long id) {
    photoRepository.delete(getEntityById(id));
  }

  public Photo getEntityById(Long id) {
    return photoRepository
        .findById(id)
        .orElseThrow(() -> new com.soccerdreamfermana.exception.ResourceNotFoundException(PHOTO_NOT_FOUND_MESSAGE));
  }

  private void applyRequest(Photo photo, PhotoRequest request) {
    photo.setTitolo(normalizationService.normalizeRequired(request.titolo()));
    photo.setDescrizione(normalizationService.normalizeOptional(request.descrizione()));
    photo.setImmagine(normalizationService.normalizeRequired(request.immagine()));
  }

  private PhotoResponse toResponse(Photo photo) {
    return new PhotoResponse(
        photo.getId(), 
        photo.getTitolo(), 
        photo.getDescrizione(), 
        photo.getImmagine(), 
        photo.getCreatedAt());
  }
}


