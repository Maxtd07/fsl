
package com.lacrisalide.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lacrisalide.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}
