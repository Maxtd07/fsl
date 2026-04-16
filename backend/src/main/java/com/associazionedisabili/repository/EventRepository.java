
package com.associazionedisabili.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.associazionedisabili.model.Event;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
 List<Event> findAllByOrderByDataAsc();
 
 List<Event> findByDataIsAfterAndDataIsBeforeOrderByDataAsc(LocalDateTime startDate, LocalDateTime endDate);
 
 List<Event> findByDataGreaterThanEqualOrderByDataAsc(LocalDateTime startDate);
}
