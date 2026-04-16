package com.associazionedisabili.dto.booking;

import java.time.LocalDateTime;

public record BookingResponse(
 Long id,
 Long eventId,
 String eventTitle,
 LocalDateTime eventDate,
 String location,
 Long userId,
 String userName,
 String userEmail,
 LocalDateTime createdAt,
 boolean emailSent,
 String calendarUrl
) {}
