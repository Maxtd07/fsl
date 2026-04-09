
package com.lacrisalide.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String nome;

 @Column(unique = true)
 private String email;

 private String password;

 private String ruolo;
}
