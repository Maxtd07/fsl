package com.soccerdreamfermana.config;

import com.soccerdreamfermana.security.CustomUserDetailsService;
import com.soccerdreamfermana.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

 private final JwtAuthenticationFilter jwtAuthenticationFilter;
 private final CustomUserDetailsService customUserDetailsService;

 @Bean
 public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http
   .cors(Customizer.withDefaults())
   .csrf(csrf -> csrf.disable())
   .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/members/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/photos/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/facebook/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/api/donations/create-payment", "/api/donations/capture-payment", "/api/donations").permitAll()
    .requestMatchers(HttpMethod.POST, "/api/email/contatti").permitAll()
    .requestMatchers("/h2-console/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/api/events/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.PUT, "/api/events/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.POST, "/api/members/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.PUT, "/api/members/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/api/members/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.POST, "/api/bookings/**").hasAnyRole("USER", "ADMIN")
    .requestMatchers(HttpMethod.GET, "/api/bookings/**").hasAnyRole("USER", "ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").hasAnyRole("USER", "ADMIN")
    .requestMatchers(HttpMethod.POST, "/api/photos/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.PUT, "/api/photos/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/api/photos/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.GET, "/api/donations/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/api/donations/**").hasRole("ADMIN")
    .anyRequest().authenticated())
   .authenticationProvider(authenticationProvider())
   .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
   .headers(headers -> headers.addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)))
   .httpBasic(httpBasic -> httpBasic.disable());

  return http.build();
 }

 @Bean
 public UserDetailsService userDetailsService() {
  return customUserDetailsService;
 }

 @Bean
 public AuthenticationProvider authenticationProvider() {
  DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
  authProvider.setUserDetailsService(customUserDetailsService);
  authProvider.setPasswordEncoder(passwordEncoder());
  return authProvider;
 }

 @Bean
 public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
  return config.getAuthenticationManager();
 }

 @Bean
 public PasswordEncoder passwordEncoder() {
  return new BCryptPasswordEncoder();
 }
}

