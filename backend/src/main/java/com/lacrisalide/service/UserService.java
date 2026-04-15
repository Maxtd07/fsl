package com.lacrisalide.service;

import com.lacrisalide.dto.auth.AuthResponse;
import com.lacrisalide.dto.auth.LoginRequest;
import com.lacrisalide.dto.auth.RegisterRequest;
import com.lacrisalide.dto.auth.UserResponse;
import com.lacrisalide.exception.BadRequestException;
import com.lacrisalide.model.Role;
import com.lacrisalide.model.User;
import com.lacrisalide.repository.UserRepository;
import com.lacrisalide.security.AppUserPrincipal;
import com.lacrisalide.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

 private final UserRepository userRepository;
 private final PasswordEncoder passwordEncoder;
 private final JwtService jwtService;
 private final AuthenticationManager authenticationManager;

 public AuthResponse register(RegisterRequest request) {
  if (userRepository.existsByEmail(request.email().trim().toLowerCase())) {
   throw new BadRequestException("Esiste già un utente registrato con questa email");
  }

  User user = userRepository.save(
   User.builder()
    .nome(request.nome().trim())
    .email(request.email().trim().toLowerCase())
    .password(passwordEncoder.encode(request.password()))
    .ruolo(Role.USER)
    .build()
  );

  AppUserPrincipal principal = new AppUserPrincipal(user);
  return new AuthResponse(jwtService.generateToken(principal), toUserResponse(user));
 }

 public AuthResponse login(LoginRequest request) {
  Authentication authentication = authenticationManager.authenticate(
   new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password())
  );

  AppUserPrincipal principal = (AppUserPrincipal) authentication.getPrincipal();
  return new AuthResponse(jwtService.generateToken(principal), toUserResponse(principal));
 }

 public User findById(Long userId) {
  return userRepository.findById(userId).orElseThrow(() -> new BadRequestException("Utente non trovato"));
 }

 public UserResponse toUserResponse(User user) {
  return new UserResponse(user.getId(), user.getNome(), user.getEmail(), user.getRuolo());
 }

 public UserResponse toUserResponse(AppUserPrincipal principal) {
  return new UserResponse(principal.getId(), principal.getNome(), principal.getEmail(), principal.getRuolo());
 }
}
