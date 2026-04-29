package com.soccerdreamfermana.service;

import com.soccerdreamfermana.exception.ResourceNotFoundException;
import java.util.List;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Servizio CRUD generico per evitare duplicazione di logica.
 * Estendi questa classe e specifica il tipo di Entity e il tipo di Response.
 *
 * @param <T> Tipo dell'entità (Entity class)
 * @param <ID> Tipo dell'identificatore (Long, String, etc)
 * @param <REQ> Tipo della Request DTO
 * @param <RES> Tipo della Response DTO
 */
@RequiredArgsConstructor
public abstract class GenericCrudService<T, ID, REQ, RES> {

  protected final JpaRepository<T, ID> repository;
  protected final String entityNotFoundMessage;

  /**
   * Crea una nuova entità
   */
  public RES create(REQ request) {
    T entity = buildEntity(request);
    return toResponse(repository.save(entity));
  }

  /**
   * Recupera tutte le entità
   */
  public List<RES> list() {
    return repository.findAll().stream().map(this::toResponse).toList();
  }

  /**
   * Recupera un'entità per ID
   */
  public RES getById(ID id) {
    return toResponse(getEntityById(id));
  }

  /**
   * Aggiorna un'entità
   */
  public RES update(ID id, REQ request) {
    T entity = getEntityById(id);
    applyRequest(entity, request);
    return toResponse(repository.save(entity));
  }

  /**
   * Elimina un'entità
   */
  public void delete(ID id) {
    repository.delete(getEntityById(id));
  }

  /**
   * Recupera l'entità o lancia eccezione
   */
  public T getEntityById(ID id) {
    return repository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(entityNotFoundMessage));
  }

  /**
   * Metodi astratti da implementare nelle subclass
   */
  protected abstract T buildEntity(REQ request);

  protected abstract void applyRequest(T entity, REQ request);

  protected abstract RES toResponse(T entity);
}

