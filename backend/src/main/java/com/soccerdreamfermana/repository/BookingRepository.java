
package com.soccerdreamfermana.repository;

import com.soccerdreamfermana.model.Booking;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {
 @EntityGraph(attributePaths = {"user", "event"})
 @Query("""
  select b
  from Booking b
  where b.event.id = :eventId
  order by b.createdAt desc
 """)
 List<Booking> findByEventIdOrderByCreatedAtDesc(@Param("eventId") Long eventId);

 @EntityGraph(attributePaths = {"user", "event"})
 @Query("""
  select b
  from Booking b
  where b.user.id = :userId
  order by b.createdAt desc
 """)
 List<Booking> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

 @Query("""
  select case when count(b) > 0 then true else false end
  from Booking b
  where b.user.id = :userId
   and b.event.id = :eventId
 """)
 boolean existsByUserIdAndEventId(@Param("userId") Long userId, @Param("eventId") Long eventId);

 @Query("""
  select count(b)
  from Booking b
  where b.event.id = :eventId
 """)
 long countByEventId(@Param("eventId") Long eventId);
}

