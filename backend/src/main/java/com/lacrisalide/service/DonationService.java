package com.lacrisalide.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Optional;
import com.lacrisalide.repository.DonationRepository;
import com.lacrisalide.model.Donation;

@Service
@RequiredArgsConstructor
public class DonationService {
 private final DonationRepository repo;

 public Donation create(Donation donation) {
  return repo.save(donation);
 }

 public List<Donation> list() {
  return repo.findAllByOrderByCreatedAtDesc();
 }

 public Optional<Donation> getById(Long id) {
  return repo.findById(id);
 }

 public void delete(Long id) {
  repo.deleteById(id);
 }
}
