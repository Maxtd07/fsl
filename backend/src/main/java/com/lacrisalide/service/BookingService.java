
package com.lacrisalide.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.lacrisalide.repository.BookingRepository;
import com.lacrisalide.model.Booking;

@Service
@RequiredArgsConstructor
public class BookingService {

 private final BookingRepository bookingRepository;

 public Booking book(Booking b){
  return bookingRepository.save(b);
 }

}
