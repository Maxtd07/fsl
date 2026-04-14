package com.lacrisalide.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Photo {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String titolo;
 private String descrizione;

 @Column(columnDefinition = "LONGTEXT")
 private String immagine; // Base64 encoded image

 @Temporal(TemporalType.TIMESTAMP)
 private LocalDateTime createdAt;

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}
