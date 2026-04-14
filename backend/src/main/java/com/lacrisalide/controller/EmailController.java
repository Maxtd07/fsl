package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;
import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

  @PostMapping("/contatti")
  public ResponseEntity<?> sendContactEmail(@RequestBody Map<String, String> request) {
    try {
      String nome = request.get("nome");
      String email = request.get("email");
      String messaggio = request.get("messaggio");

      // Validazione base
      if (nome == null || nome.trim().isEmpty() ||
          email == null || email.trim().isEmpty() ||
          messaggio == null || messaggio.trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("error", "Tutti i campi sono obbligatori"));
      }

      // Log dell'email ricevuta
      log.info("Email ricevuta da: {} ({}) - Messaggio: {}", nome, email, messaggio);

      // TODO: Implementare invio email reale
      // Per ora simuliamo l'invio con un log
      Map<String, String> response = new HashMap<>();
      response.put("success", "true");
      response.put("message", "Email ricevuta con successo. Ti contatteremo presto!");

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      log.error("Errore nell'elaborazione dell'email: ", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(Map.of("error", "Errore nell'invio della richiesta"));
    }
  }
}
