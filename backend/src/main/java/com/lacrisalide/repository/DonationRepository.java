package com.lacrisalide.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lacrisalide.model.Donation;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
 List<Donation> findAllByOrderByCreatedAtDesc();
}
