
package com.associazionedisabili.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.associazionedisabili.model.Booking;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
 List<Booking> findByEventIdOrderByCreatedAtDesc(Long eventId);
 List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
 boolean existsByUserIdAndEventId(Long userId, Long eventId);
 long countByEventId(Long eventId);
}
