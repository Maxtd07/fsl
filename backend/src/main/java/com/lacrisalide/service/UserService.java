
package com.lacrisalide.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.lacrisalide.repository.UserRepository;
import com.lacrisalide.model.User;

@Service
@RequiredArgsConstructor
public class UserService {

 private final UserRepository userRepository;

 public User register(User user){
  return userRepository.save(user);
 }

}
