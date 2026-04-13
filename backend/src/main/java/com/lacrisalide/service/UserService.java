
package com.lacrisalide.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.lacrisalide.repository.UserRepository;
import com.lacrisalide.model.User;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
 private final UserRepository repo;

 public User register(User u){
  return repo.save(u);
 }

 public User authenticate(String username, String password){
  Optional<User> user = repo.findByEmail(username);
  
  if(user.isPresent() && user.get().getPassword().equals(password)){
   return user.get();
  }
  
  return null;
 }
}
