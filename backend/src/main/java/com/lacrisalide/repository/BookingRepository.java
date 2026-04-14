
package com.lacrisalide.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lacrisalide.model.Booking;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
 List<Booking> findByEventId(Long eventId);
 List<Booking> findByUserId(Long userId);
}
