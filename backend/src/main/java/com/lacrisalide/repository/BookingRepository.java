
package com.lacrisalide.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lacrisalide.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {}
