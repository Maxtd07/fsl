package com.associazionedisabili.controller;

import com.associazionedisabili.dto.member.MemberRequest;
import com.associazionedisabili.dto.member.MemberResponse;
import com.associazionedisabili.service.MemberService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

 private final MemberService memberService;

 @PostMapping
 public ResponseEntity<MemberResponse> create(@Valid @RequestBody MemberRequest request) {
  MemberResponse response = memberService.create(request);
  return ResponseEntity.created(URI.create("/api/members/" + response.id())).body(response);
 }

 @GetMapping
 public List<MemberResponse> list() {
  return memberService.list();
 }

 @GetMapping("/{id}")
 public MemberResponse getById(@PathVariable Long id) {
  return memberService.getById(id);
 }

 @PutMapping("/{id}")
 public MemberResponse update(@PathVariable Long id, @Valid @RequestBody MemberRequest request) {
  return memberService.update(id, request);
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> delete(@PathVariable Long id) {
  memberService.delete(id);
  return ResponseEntity.noContent().build();
 }
}
