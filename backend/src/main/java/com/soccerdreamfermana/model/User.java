package com.soccerdreamfermana.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
 name = "users",
 uniqueConstraints = {
  @UniqueConstraint(name = "uk_users_email", columnNames = "email")
 },
 indexes = {
  @Index(name = "idx_users_email", columnList = "email"),
  @Index(name = "idx_users_created_at", columnList = "created_at")
 }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 @Column(name = "id")
 private Long id;

 @Column(name = "nome", nullable = false, length = 120)
 private String nome;

 @Column(name = "email", nullable = false, length = 160)
 private String email;

 @Column(name = "password", nullable = false)
 @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
 private String password;

 @Enumerated(EnumType.STRING)
 @Column(name = "ruolo", nullable = false, length = 20)
 private Role ruolo;

 @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
 @OrderBy("createdAt DESC")
 @JsonIgnore
 @Builder.Default
 private List<Booking> bookings = new ArrayList<>();

 @Column(name = "created_at", nullable = false, updatable = false)
 private LocalDateTime createdAt;

 public void addBooking(Booking booking) {
  bookings.add(booking);
  booking.setUser(this);
 }

 public void removeBooking(Booking booking) {
  bookings.remove(booking);
  booking.setUser(null);
 }

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}

