package com.associazionedisabili.config;

import com.associazionedisabili.model.Event;
import com.associazionedisabili.model.Role;
import com.associazionedisabili.model.User;
import com.associazionedisabili.repository.EventRepository;
import com.associazionedisabili.repository.UserRepository;
import java.util.List;
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
   if (!userRepository.existsByEmail("admin@soccerdream.it")) {
    userRepository.save(
     User.builder()
      .nome("Admin soccerdream")
      .email("admin@soccerdream.it")
      .password(passwordEncoder.encode("ilsognofermana"))
      .ruolo(Role.ADMIN)
      .build()
    );
   }

   List<Event> events = eventRepository.findAll();
   if (events.size() == 2 && events.stream().allMatch(this::isDefaultSeedEvent)) {
    eventRepository.deleteAll(events);
   }
  };
 }

 private boolean isDefaultSeedEvent(Event event) {
  return "Laboratorio inclusivo di primavera".equals(event.getTitolo())
   || "Incontro di sostegno per caregiver".equals(event.getTitolo());
 }
}
