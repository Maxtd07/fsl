package com.associazionedisabili.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
 name = "bookings",
 uniqueConstraints = {
  @UniqueConstraint(name = "uk_booking_user_event", columnNames = {"user_id", "event_id"})
 }
)
public class Booking {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @ManyToOne(fetch = FetchType.LAZY, optional = false)
 @JoinColumn(name = "user_id", nullable = false)
 private User user;

 @ManyToOne(fetch = FetchType.LAZY, optional = false)
 @JoinColumn(name = "event_id", nullable = false)
 private Event event;

 @Column(nullable = false, updatable = false)
 private LocalDateTime createdAt;

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}
