
package com.lacrisalide.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @ManyToOne
 @JoinColumn(name="user_id")
 private User user;

 @ManyToOne
 @JoinColumn(name="event_id")
 private Event event;
}
