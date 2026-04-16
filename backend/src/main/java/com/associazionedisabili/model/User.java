package com.associazionedisabili.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false, length = 120)
 private String nome;

 @Column(nullable = false, unique = true, length = 160)
 private String email;

 @Column(nullable = false)
 @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
 private String password;

 @Column(nullable = false)
 @Enumerated(EnumType.STRING)
 private Role ruolo;

 @Column(nullable = false, updatable = false)
 private LocalDateTime createdAt;

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}
