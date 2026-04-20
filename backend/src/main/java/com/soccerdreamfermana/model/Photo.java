package com.soccerdreamfermana.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
 name = "photos",
 indexes = {
  @Index(name = "idx_photos_created_at", columnList = "created_at")
 }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Photo {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 @Column(name = "id")
 private Long id;

 @Column(name = "titolo", length = 180)
 private String titolo;

 @Column(name = "descrizione", length = 3000)
 private String descrizione;

 @Lob
 @Column(name = "immagine")
 private String immagine; // Base64 encoded image

 @Column(name = "created_at", nullable = false, updatable = false)
 private LocalDateTime createdAt;

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}

