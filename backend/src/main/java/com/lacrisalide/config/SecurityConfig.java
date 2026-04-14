
package com.lacrisalide.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

 @Bean
 public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http
   .cors(Customizer.withDefaults())
   .csrf(csrf -> csrf.disable())
   .authorizeHttpRequests(auth -> auth
     .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
     .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
     .requestMatchers(HttpMethod.GET, "/api/bookings/**").permitAll()
     .requestMatchers(HttpMethod.GET, "/api/photos/**").permitAll()
     .requestMatchers(HttpMethod.GET, "/api/donations/**").permitAll()
     .requestMatchers(HttpMethod.POST, "/api/events/**").permitAll()
     .requestMatchers(HttpMethod.PUT, "/api/events/**").permitAll()
     .requestMatchers(HttpMethod.POST, "/api/bookings/**").permitAll()
     .requestMatchers(HttpMethod.POST, "/api/photos/**").permitAll()
     .requestMatchers(HttpMethod.POST, "/api/donations/**").permitAll()
     .requestMatchers(HttpMethod.PUT, "/api/photos/**").permitAll()
     .requestMatchers(HttpMethod.DELETE, "/api/events/**").permitAll()
     .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").permitAll()
     .requestMatchers(HttpMethod.DELETE, "/api/photos/**").permitAll()
     .requestMatchers(HttpMethod.DELETE, "/api/donations/**").permitAll()
     .requestMatchers("/api/auth/**").permitAll()
     .requestMatchers("/api/email/**").permitAll()
     .anyRequest().authenticated())
   .httpBasic(Customizer.withDefaults());

  return http.build();
 }
}
