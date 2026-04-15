package com.lacrisalide.dto.auth;

public record AuthResponse(
 String token,
 UserResponse user
) {}
