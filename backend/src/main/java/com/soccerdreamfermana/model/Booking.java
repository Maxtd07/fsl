package com.soccerdreamfermana.model;

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
 },
 indexes = {
  @Index(name = "idx_bookings_user_id", columnList = "user_id"),
  @Index(name = "idx_bookings_event_id", columnList = "event_id"),
  @Index(name = "idx_bookings_created_at", columnList = "created_at")
 }
)
public class Booking {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 @Column(name = "id")
 private Long id;

 @ManyToOne(fetch = FetchType.LAZY, optional = false)
 @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_bookings_users"))
 private User user;

 @ManyToOne(fetch = FetchType.LAZY, optional = false)
 @JoinColumn(name = "event_id", nullable = false, foreignKey = @ForeignKey(name = "fk_bookings_events"))
 private Event event;

 @Column(name = "created_at", nullable = false, updatable = false)
 private LocalDateTime createdAt;

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}

