package com.associazionedisabili.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.associazionedisabili.model.Photo;
import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
 List<Photo> findAllByOrderByCreatedAtDesc();
}
