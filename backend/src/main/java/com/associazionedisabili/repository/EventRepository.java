
package com.associazionedisabili.repository;

import com.associazionedisabili.model.Event;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {
 @Query("""
  select e
  from Event e
  order by e.data asc
 """)
 List<Event> findAllByOrderByDataAsc();

 @Query("""
  select e
  from Event e
  where e.data > :startDate
   and e.data < :endDate
  order by e.data asc
 """)
 List<Event> findByDataIsAfterAndDataIsBeforeOrderByDataAsc(
  @Param("startDate") LocalDateTime startDate,
  @Param("endDate") LocalDateTime endDate
 );

 @Query("""
  select e
  from Event e
  where e.data >= :startDate
  order by e.data asc
 """)
 List<Event> findByDataGreaterThanEqualOrderByDataAsc(@Param("startDate") LocalDateTime startDate);
}
