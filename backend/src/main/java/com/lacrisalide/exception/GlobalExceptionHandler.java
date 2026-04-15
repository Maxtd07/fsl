package com.lacrisalide.exception;

import com.lacrisalide.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

 @ExceptionHandler(ResourceNotFoundException.class)
 public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
  return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
 }

 @ExceptionHandler({BadRequestException.class, ConstraintViolationException.class})
 public ResponseEntity<ApiErrorResponse> handleBadRequest(Exception ex, HttpServletRequest request) {
  return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request, null);
 }

 @ExceptionHandler(MethodArgumentNotValidException.class)
 public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
  Map<String, String> errors = new LinkedHashMap<>();
  for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
   errors.put(fieldError.getField(), fieldError.getDefaultMessage());
  }
  return buildResponse(HttpStatus.BAD_REQUEST, "Controlla i dati inviati", request, errors);
 }

 @ExceptionHandler({BadCredentialsException.class, AccessDeniedException.class})
 public ResponseEntity<ApiErrorResponse> handleAuth(Exception ex, HttpServletRequest request) {
  HttpStatus status = ex instanceof AccessDeniedException ? HttpStatus.FORBIDDEN : HttpStatus.UNAUTHORIZED;
  String message = ex instanceof AccessDeniedException ? "Non hai i permessi necessari" : "Credenziali non valide";
  return buildResponse(status, message, request, null);
 }

 @ExceptionHandler(MailException.class)
 public ResponseEntity<ApiErrorResponse> handleMail(MailException ex, HttpServletRequest request) {
  return buildResponse(HttpStatus.BAD_GATEWAY, "Invio email non riuscito", request, null);
 }

 @ExceptionHandler(Exception.class)
 public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex, HttpServletRequest request) {
  return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Si è verificato un errore interno", request, null);
 }

 private ResponseEntity<ApiErrorResponse> buildResponse(
  HttpStatus status,
  String message,
  HttpServletRequest request,
  Map<String, String> validationErrors
 ) {
  return ResponseEntity.status(status).body(
   new ApiErrorResponse(
    LocalDateTime.now(),
    status.value(),
    status.getReasonPhrase(),
    message,
    request.getRequestURI(),
    validationErrors
   )
  );
 }
}
