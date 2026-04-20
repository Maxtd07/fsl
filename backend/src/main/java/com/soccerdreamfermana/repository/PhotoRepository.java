package com.soccerdreamfermana.repository;

import com.soccerdreamfermana.model.Photo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
 @Query("""
  select p
  from Photo p
  order by p.createdAt desc
 """)
 List<Photo> findAllByOrderByCreatedAtDesc();
}

