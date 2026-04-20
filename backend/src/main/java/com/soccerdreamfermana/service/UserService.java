package com.soccerdreamfermana.service;

import com.soccerdreamfermana.dto.auth.AuthResponse;
import com.soccerdreamfermana.dto.auth.LoginRequest;
import com.soccerdreamfermana.dto.auth.RegisterRequest;
import com.soccerdreamfermana.dto.auth.UserResponse;
import com.soccerdreamfermana.exception.BadRequestException;
import com.soccerdreamfermana.model.Role;
import com.soccerdreamfermana.model.User;
import com.soccerdreamfermana.repository.UserRepository;
import com.soccerdreamfermana.security.AppUserPrincipal;
import com.soccerdreamfermana.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

 private static final String USER_NOT_FOUND_MESSAGE = "Utente non trovato";
 private static final String DUPLICATE_EMAIL_MESSAGE = "Esiste giÃƒÂ  un utente registrato con questa email";

 private final UserRepository userRepository;
 private final PasswordEncoder passwordEncoder;
 private final JwtService jwtService;
 private final AuthenticationManager authenticationManager;

 public AuthResponse register(RegisterRequest request) {
  String normalizedEmail = normalizeEmail(request.email());
  if (userRepository.existsByEmail(normalizedEmail)) {
   throw new BadRequestException(DUPLICATE_EMAIL_MESSAGE);
  }

  User user = userRepository.save(buildUser(request, normalizedEmail));
  return buildAuthResponse(user);
 }

 public AuthResponse login(LoginRequest request) {
  Authentication authentication = authenticationManager.authenticate(
   new UsernamePasswordAuthenticationToken(normalizeEmail(request.email()), request.password())
  );

  AppUserPrincipal principal = (AppUserPrincipal) authentication.getPrincipal();
  return new AuthResponse(jwtService.generateToken(principal), buildUserResponse(principal));
 }

 public User findById(Long userId) {
  return userRepository.findById(userId).orElseThrow(() -> new BadRequestException(USER_NOT_FOUND_MESSAGE));
 }

 public UserResponse toUserResponse(User user) {
  return buildUserResponse(user);
 }

 public UserResponse toUserResponse(AppUserPrincipal principal) {
  return buildUserResponse(principal);
 }

 private AuthResponse buildAuthResponse(User user) {
  AppUserPrincipal principal = new AppUserPrincipal(user);
  return new AuthResponse(jwtService.generateToken(principal), buildUserResponse(user));
 }

 private User buildUser(RegisterRequest request, String normalizedEmail) {
  return User.builder()
   .nome(request.nome().trim())
   .email(normalizedEmail)
   .password(passwordEncoder.encode(request.password()))
   .ruolo(Role.USER)
   .build();
 }

 private UserResponse buildUserResponse(User user) {
  return new UserResponse(user.getId(), user.getNome(), user.getEmail(), user.getRuolo());
 }

 private UserResponse buildUserResponse(AppUserPrincipal principal) {
  return new UserResponse(principal.getId(), principal.getNome(), principal.getEmail(), principal.getRuolo());
 }

 private String normalizeEmail(String email) {
  return email.trim().toLowerCase();
 }
}

