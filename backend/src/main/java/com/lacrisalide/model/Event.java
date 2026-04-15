package com.lacrisalide.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events")
public class Event {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false, length = 180)
 private String titolo;

 @Column(nullable = false, length = 3000)
 private String descrizione;

 @Column(nullable = false)
 private LocalDateTime data;

 private LocalDateTime dataFine;

 @Column(nullable = false, length = 240)
 private String luogo;

 @Column(nullable = false)
 private Integer maxPartecipanti;

 @Column(columnDefinition = "LONGTEXT")
 private String volantino;

 @Column(nullable = false, updatable = false)
 private LocalDateTime createdAt;

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}
