package com.soccerdreamfermana.dto.auth;

public record AuthResponse(
 String token,
 UserResponse user
) {}

