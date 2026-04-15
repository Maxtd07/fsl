
package com.lacrisalide.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lacrisalide.model.Event;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
 List<Event> findAllByOrderByDataAsc();
}
