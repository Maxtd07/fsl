package com.soccerdreamfermana.service;

import com.soccerdreamfermana.dto.member.MemberRequest;
import com.soccerdreamfermana.dto.member.MemberResponse;
import com.soccerdreamfermana.exception.BadRequestException;
import com.soccerdreamfermana.exception.ResourceNotFoundException;
import com.soccerdreamfermana.model.Member;
import com.soccerdreamfermana.repository.MemberRepository;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

 private static final String MEMBER_NOT_FOUND_MESSAGE = "Membro non trovato";
 private static final String INVALID_NAME_FORMAT_MESSAGE = "Il nome deve essere nel formato Cognome Nome";
 private static final String INVALID_POSITION_MESSAGE = "La posizione selezionata non e valida";
 private static final String DUPLICATE_SHIRT_NUMBER_MESSAGE = "Il numero di maglia e gia assegnato a un altro giocatore";
 private static final Pattern PLAYER_ROLE_PATTERN = Pattern.compile("\\bgiocatore\\b", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
 private static final Set<String> ALLOWED_POSITIONS = Set.of("attacker", "defender", "midfielder", "goalkeeper", "reserve");

 private final MemberRepository memberRepository;

 public MemberResponse create(MemberRequest request) {
  Member member = new Member();
  applyRequest(member, request);
  return toResponse(saveMember(member));
 }

 public List<MemberResponse> list() {
  return memberRepository.findAllByOrderByNameAsc().stream()
   .map(this::toResponse)
   .toList();
 }

 public MemberResponse getById(Long id) {
  return toResponse(getEntityById(id));
 }

 public MemberResponse update(Long id, MemberRequest request) {
  Member member = getEntityById(id);
  applyRequest(member, request);
  return toResponse(saveMember(member));
 }

 public void delete(Long id) {
  memberRepository.delete(getEntityById(id));
 }

 public Member getEntityById(Long id) {
  return memberRepository.findById(id)
   .orElseThrow(() -> new ResourceNotFoundException(MEMBER_NOT_FOUND_MESSAGE));
 }

 public static boolean isPlayerRole(String role) {
  if (role == null) {
   return false;
  }

  return PLAYER_ROLE_PATTERN.matcher(role).find();
 }

 private void applyRequest(Member member, MemberRequest request) {
  String normalizedName = normalizeName(request.name());
  String normalizedRole = normalizeRequiredText(request.role());
  boolean isPlayer = isPlayerRole(normalizedRole);

  member.setName(normalizedName);
  member.setRole(normalizedRole);
  member.setPosition(normalizePosition(request.position(), isPlayer));
  member.setShirtNumber(normalizeShirtNumber(request.shirtNumber(), isPlayer));
  member.setImageUrl(normalizeOptionalText(request.imageUrl()));

  validateUniqueShirtNumber(member);
 }

 private Member saveMember(Member member) {
  try {
   return memberRepository.save(member);
  } catch (DataIntegrityViolationException ex) {
   throw new BadRequestException(DUPLICATE_SHIRT_NUMBER_MESSAGE);
  }
 }

 private void validateUniqueShirtNumber(Member member) {
  Integer shirtNumber = member.getShirtNumber();
  if (shirtNumber == null) {
   return;
  }

  boolean alreadyAssigned = member.getId() == null
   ? memberRepository.existsByShirtNumber(shirtNumber)
   : memberRepository.existsByShirtNumberAndIdNot(shirtNumber, member.getId());

  if (alreadyAssigned) {
   throw new BadRequestException(DUPLICATE_SHIRT_NUMBER_MESSAGE);
  }
 }

 private String normalizeName(String value) {
  String normalized = normalizeRequiredText(value);
  if (!normalized.contains(" ")) {
   throw new BadRequestException(INVALID_NAME_FORMAT_MESSAGE);
  }
  return normalized;
 }

 private String normalizePosition(String value, boolean isPlayer) {
  if (!isPlayer) {
   return null;
  }

  String normalized = normalizeOptionalText(value);
  if (normalized == null) {
   return null;
  }

  String lowerCasePosition = normalized.toLowerCase();
  if (!ALLOWED_POSITIONS.contains(lowerCasePosition)) {
   throw new BadRequestException(INVALID_POSITION_MESSAGE);
  }

  return lowerCasePosition;
 }

 private Integer normalizeShirtNumber(Integer shirtNumber, boolean isPlayer) {
  if (!isPlayer) {
   return null;
  }

  return shirtNumber;
 }

 private String normalizeRequiredText(String value) {
  String normalized = normalizeOptionalText(value);
  if (normalized == null) {
   throw new BadRequestException("Valore obbligatorio mancante");
  }
  return normalized;
 }

 private String normalizeOptionalText(String value) {
  if (value == null) {
   return null;
  }

  String normalized = value.trim().replaceAll("\\s+", " ");
  return normalized.isBlank() ? null : normalized;
 }

 private MemberResponse toResponse(Member member) {
  return new MemberResponse(
   member.getId(),
   member.getName(),
   member.getRole(),
   member.getPosition(),
   member.getShirtNumber(),
   member.getImageUrl()
  );
 }
}

