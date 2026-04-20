
package com.soccerdreamfermana.repository;

import com.soccerdreamfermana.model.Event;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {
 @Query("""
  select e
  from Event e
  where (:tipo is null or coalesce(e.tipo, 'evento') = :tipo)
  order by e.data asc
 """)
 List<Event> findAllByTipoOrderByDataAsc(@Param("tipo") String tipo);

 @Query("""
  select e
  from Event e
  where e.data > :startDate
   and e.data < :endDate
   and (:tipo is null or coalesce(e.tipo, 'evento') = :tipo)
  order by e.data asc
 """)
 List<Event> findByDataIsAfterAndDataIsBeforeOrderByDataAsc(
  @Param("startDate") LocalDateTime startDate,
  @Param("endDate") LocalDateTime endDate,
  @Param("tipo") String tipo
 );

 @Query("""
  select e
  from Event e
  where e.data >= :startDate
   and (:tipo is null or coalesce(e.tipo, 'evento') = :tipo)
  order by e.data asc
 """)
 List<Event> findByDataGreaterThanEqualOrderByDataAsc(
  @Param("startDate") LocalDateTime startDate,
  @Param("tipo") String tipo
 );
}

