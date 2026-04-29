package com.soccerdreamfermana.service;

import com.soccerdreamfermana.exception.BadRequestException;
import org.springframework.stereotype.Service;

/**
 * Servizio centralizzato per la normalizzazione di stringhe.
 * Evita duplicazione di logica di normalizzazione tra i vari service.
 */
@Service
public class StringNormalizationService {

  private static final String REQUIRED_FIELD_MISSING_MESSAGE = "Valore obbligatorio mancante";

  /**
   * Normalizza una stringa obbligatoria: trim + whitespace
   *
   * @param value Valore da normalizzare
   * @return Stringa normalizzata (non null)
   * @throws BadRequestException se il valore è null o vuoto
   */
  public String normalizeRequired(String value) {
    String normalized = normalizeOptional(value);
    if (normalized == null) {
      throw new BadRequestException(REQUIRED_FIELD_MISSING_MESSAGE);
    }
    return normalized;
  }

  /**
   * Normalizza una stringa opzionale: trim + whitespace
   *
   * @param value Valore da normalizzare (può essere null)
   * @return Stringa normalizzata o null se vuota
   */
  public String normalizeOptional(String value) {
    if (value == null) {
      return null;
    }

    String normalized = value.trim().replaceAll("\\s+", " ");
    return normalized.isBlank() ? null : normalized;
  }

  /**
   * Normalizza email: trim + lowercase
   *
   * @param email Email da normalizzare
   * @return Email normalizzata (lowercase, senza spazi)
   * @throws BadRequestException se l'email è null o vuota
   */
  public String normalizeEmail(String email) {
    String normalized = normalizeRequired(email);
    return normalized.toLowerCase();
  }

  /**
   * Normalizza un enum string (case-insensitive):
   * trim + lowercase, e verifica che sia uno dei valori consentiti
   *
   * @param value Valore da normalizzare
   * @param allowedValues Valori consentiti (lowercase)
   * @param fieldName Nome del campo (per messaggi di errore)
   * @return Valore normalizzato e validato
   * @throws BadRequestException se non è uno dei valori consentiti
   */
  public String normalizeAndValidateEnum(
      String value, java.util.Set<String> allowedValues, String fieldName) {
    String normalized = normalizeRequired(value);
    String lowerCase = normalized.toLowerCase();

    if (!allowedValues.contains(lowerCase)) {
      throw new BadRequestException("Il valore " + fieldName + " non è valido");
    }

    return lowerCase;
  }
}

