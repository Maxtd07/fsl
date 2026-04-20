package com.soccerdreamfermana.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
 name = "members",
 uniqueConstraints = {
  @UniqueConstraint(name = "uk_members_shirt_number", columnNames = "shirt_number")
 },
 indexes = {
  @Index(name = "idx_members_name", columnList = "name"),
  @Index(name = "idx_members_role", columnList = "role"),
  @Index(name = "idx_members_created_at", columnList = "created_at")
 }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 @Column(name = "id")
 private Long id;

 @Column(name = "name", nullable = false, length = 180)
 private String name;

 @Column(name = "role", nullable = false, length = 180)
 private String role;

 @Column(name = "position", length = 40)
 private String position;

 @Column(name = "shirt_number", unique = true)
 private Integer shirtNumber;

 @Lob
 @Column(name = "image_url")
 private String imageUrl;

 @Column(name = "created_at", nullable = false, updatable = false)
 private LocalDateTime createdAt;

 @PrePersist
 protected void onCreate() {
  createdAt = LocalDateTime.now();
 }
}

