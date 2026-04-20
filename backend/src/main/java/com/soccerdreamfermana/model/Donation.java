package com.soccerdreamfermana.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
 name = "donations",
 indexes = {
  @Index(name = "idx_donations_created_at", columnList = "created_at"),
  @Index(name = "idx_donations_payment_status", columnList = "payment_status")
 }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 @Column(name = "id")
 private Long id;

 @Column(name = "nome", nullable = false, length = 120)
 private String nome;

 @Column(name = "email", nullable = false, length = 160)
 private String email;

 @Column(name = "importo", nullable = false)
 private Double importo;

 @Column(name = "paypal_order_id", length = 80)
 private String paypalOrderId;

 @Column(name = "payer_id", length = 80)
 private String payerId;

 @Column(name = "capture_id", length = 80)
 private String captureId;

 @Column(name = "payment_status", length = 40)
 private String paymentStatus;

 @Column(name = "created_at", nullable = false, updatable = false)
 private LocalDateTime createdAt;

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}

