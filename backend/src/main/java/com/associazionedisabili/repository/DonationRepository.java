package com.associazionedisabili.repository;

import com.associazionedisabili.model.Donation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DonationRepository extends JpaRepository<Donation, Long> {
 @Query("""
  select d
  from Donation d
  order by d.createdAt desc
 """)
 List<Donation> findAllByOrderByCreatedAtDesc();
}
