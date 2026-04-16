package com.associazionedisabili.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.associazionedisabili.model.Donation;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
 List<Donation> findAllByOrderByCreatedAtDesc();
}
