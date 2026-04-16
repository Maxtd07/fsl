package com.associazionedisabili.security;

import com.associazionedisabili.model.Role;
import com.associazionedisabili.model.User;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
public class AppUserPrincipal implements UserDetails {

 private final Long id;
 private final String nome;
 private final String email;
 private final String password;
 private final Role ruolo;
 private final List<SimpleGrantedAuthority> authorities;

 public AppUserPrincipal(User user) {
  this.id = user.getId();
  this.nome = user.getNome();
  this.email = user.getEmail();
  this.password = user.getPassword();
  this.ruolo = user.getRuolo();
  this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRuolo().name()));
 }

 @Override
 public Collection<? extends GrantedAuthority> getAuthorities() {
  return authorities;
 }

 @Override
 public String getPassword() {
  return password;
 }

 @Override
 public String getUsername() {
  return email;
 }

 @Override
 public boolean isAccountNonExpired() {
  return true;
 }

 @Override
 public boolean isAccountNonLocked() {
  return true;
 }

 @Override
 public boolean isCredentialsNonExpired() {
  return true;
 }

 @Override
 public boolean isEnabled() {
  return true;
 }
}
