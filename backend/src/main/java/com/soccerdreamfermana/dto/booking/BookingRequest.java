package com.soccerdreamfermana.dto.booking;

import jakarta.validation.constraints.NotNull;

public record BookingRequest(
 @NotNull(message = "L'id dell'evento Ã¨ obbligatorio")
 Long eventId
) {}

