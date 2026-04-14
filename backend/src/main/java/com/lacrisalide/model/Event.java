
package com.lacrisalide.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 private String titolo;
 private String descrizione;
 private LocalDateTime data;
 private String luogo;
 private Integer maxPartecipanti;
 
 @Column(columnDefinition = "LONGTEXT")
 private String volantino; // Base64 encoded image or URL
}
