package com.lacrisalide.dto.auth;

import com.lacrisalide.model.Role;

public record UserResponse(
 Long id,
 String nome,
 String email,
 Role ruolo
) {}
