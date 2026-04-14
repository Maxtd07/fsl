package com.lacrisalide.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lacrisalide.model.Photo;
import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
 List<Photo> findAllByOrderByCreatedAtDesc();
}
