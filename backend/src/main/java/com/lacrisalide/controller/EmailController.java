package com.lacrisalide.controller;

import com.lacrisalide.dto.email.ContactRequest;
import com.lacrisalide.service.EmailService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

 private final EmailService emailService;

 @PostMapping("/contatti")
 public ResponseEntity<Map<String, Object>> sendContactEmail(@Valid @RequestBody ContactRequest request) {
  boolean delivered = emailService.sendContactEmail(request);
  return ResponseEntity.ok(
   Map.of(
    "success", true,
    "delivered", delivered,
    "message", delivered
     ? "Email inviata con successo. Ti contatteremo presto!"
     : "Richiesta ricevuta correttamente. L'invio email non è configurato in questo ambiente."
   )
  );
 }
}
