package com.soccerdreamfermana.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
 name = "events",
 indexes = {
  @Index(name = "idx_events_data_evento", columnList = "data_evento"),
  @Index(name = "idx_events_created_at", columnList = "created_at")
 }
)
public class Event {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 @Column(name = "id")
 private Long id;

 @Column(name = "titolo", nullable = false, length = 180)
 private String titolo;

 @Column(name = "tipo", length = 40)
 private String tipo;

 @Column(name = "descrizione", nullable = false, length = 3000)
 private String descrizione;

 @Column(name = "data_evento", nullable = false)
 private LocalDateTime data;

 @Column(name = "data_fine")
 private LocalDateTime dataFine;

 @Column(name = "luogo", nullable = false, length = 240)
 private String luogo;

 @Column(name = "max_partecipanti", nullable = false)
 private Integer maxPartecipanti;

 @Column(name = "unlimited_capacity", nullable = false)
 private boolean unlimitedCapacity;

 @Lob
 @Column(name = "volantino")
 private String volantino;

 @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
 @OrderBy("createdAt DESC")
 @JsonIgnore
 @Builder.Default
 private List<Booking> bookings = new ArrayList<>();

 @Column(name = "created_at", nullable = false, updatable = false)
 private LocalDateTime createdAt;

 public void addBooking(Booking booking) {
  bookings.add(booking);
  booking.setEvent(this);
 }

 public void removeBooking(Booking booking) {
  bookings.remove(booking);
  booking.setEvent(null);
 }

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}

