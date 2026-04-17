package com.associazionedisabili.dto.member;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberRequest(
 @NotBlank(message = "Il nome e obbligatorio")
 @Size(max = 180, message = "Il nome non puo superare 180 caratteri")
 String name,

 @NotBlank(message = "Il ruolo e obbligatorio")
 @Size(max = 180, message = "Il ruolo non puo superare 180 caratteri")
 String role,

 @Size(max = 40, message = "La posizione non puo superare 40 caratteri")
 String position,

 @Min(value = 1, message = "Il numero di maglia deve essere almeno 1")
 Integer shirtNumber,

 String imageUrl
) {}
