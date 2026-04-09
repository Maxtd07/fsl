
package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.lacrisalide.service.UserService;
import com.lacrisalide.model.User;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

 private final UserService userService;

 @PostMapping("/register")
 public User register(@RequestBody User user){
  return userService.register(user);
 }

}
