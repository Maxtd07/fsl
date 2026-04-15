package com.lacrisalide.config;

import com.lacrisalide.model.Event;
import com.lacrisalide.model.Role;
import com.lacrisalide.model.User;
import com.lacrisalide.repository.EventRepository;
import com.lacrisalide.repository.UserRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

 private final UserRepository userRepository;
 private final EventRepository eventRepository;
 private final PasswordEncoder passwordEncoder;

 @Bean
 public CommandLineRunner seedInitialData() {
  return args -> {
   if (!userRepository.existsByEmail("admin@lacrisalide.it")) {
    userRepository.save(
     User.builder()
      .nome("Admin La Crisalide")
      .email("admin@lacrisalide.it")
      .password(passwordEncoder.encode("Admin123!"))
      .ruolo(Role.ADMIN)
      .build()
    );
   }

   if (eventRepository.count() == 0) {
    eventRepository.save(
     Event.builder()
      .titolo("Laboratorio inclusivo di primavera")
      .descrizione("Un pomeriggio dedicato alle famiglie con attivita creative, musica e condivisione.")
      .data(LocalDateTime.now().plusDays(7).withHour(15).withMinute(0).withSecond(0).withNano(0))
      .dataFine(LocalDateTime.now().plusDays(7).withHour(18).withMinute(0).withSecond(0).withNano(0))
      .luogo("Centro La Crisalide, Roma")
      .maxPartecipanti(40)
      .volantino(null)
      .build()
    );
    eventRepository.save(
     Event.builder()
      .titolo("Incontro di sostegno per caregiver")
      .descrizione("Spazio di confronto guidato con professionisti e famiglie per condividere strumenti utili.")
      .data(LocalDateTime.now().plusDays(18).withHour(10).withMinute(30).withSecond(0).withNano(0))
      .dataFine(LocalDateTime.now().plusDays(18).withHour(12).withMinute(30).withSecond(0).withNano(0))
      .luogo("Sala comunitaria, Milano")
      .maxPartecipanti(25)
      .volantino(null)
      .build()
    );
   }
  };
 }
}
