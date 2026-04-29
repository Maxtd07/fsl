package com.soccerdreamfermana.dto.auth;

import com.soccerdreamfermana.model.Role;

public record UserResponse(
 Long id,
 String nome,
 String email,
 Role ruolo
) {}

