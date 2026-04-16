package com.associazionedisabili.dto.auth;

import com.associazionedisabili.model.Role;

public record UserResponse(
 Long id,
 String nome,
 String email,
 Role ruolo
) {}
