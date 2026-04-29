package com.soccerdreamfermana.dto.member;

public record MemberResponse(
 Long id,
 String name,
 String role,
 String position,
 Integer shirtNumber,
 String imageUrl
) {}

