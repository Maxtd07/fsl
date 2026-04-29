package com.soccerdreamfermana.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

 private final Key signingKey;
 private final long expirationMs;

 public JwtService(
  @Value("${app.jwt.secret}") String secret,
  @Value("${app.jwt.expiration-ms}") long expirationMs
 ) {
  this.signingKey = buildSigningKey(secret);
  this.expirationMs = expirationMs;
 }

 public String generateToken(AppUserPrincipal principal) {
  Map<String, Object> claims = new HashMap<>();
  claims.put("userId", principal.getId());
  claims.put("nome", principal.getNome());
  claims.put("role", principal.getRuolo().name());

  Date now = new Date();
  Date expiry = new Date(now.getTime() + expirationMs);

  return Jwts.builder()
   .claims(claims)
   .subject(principal.getUsername())
   .issuedAt(now)
   .expiration(expiry)
   .signWith(signingKey)
   .compact();
 }

 public String extractUsername(String token) {
  return extractClaims(token).getSubject();
 }

 public boolean isTokenValid(String token, UserDetails userDetails) {
  Claims claims = extractClaims(token);
  return claims.getSubject().equals(userDetails.getUsername()) && claims.getExpiration().after(new Date());
 }

 private Claims extractClaims(String token) {
  return Jwts.parser()
   .verifyWith((javax.crypto.SecretKey) signingKey)
   .build()
   .parseSignedClaims(token)
   .getPayload();
 }

 private Key buildSigningKey(String secret) {
  byte[] keyBytes;
  try {
   keyBytes = Decoders.BASE64.decode(secret);
  } catch (IllegalArgumentException ex) {
   keyBytes = secret.getBytes(StandardCharsets.UTF_8);
  }
  return Keys.hmacShaKeyFor(keyBytes);
 }
}

