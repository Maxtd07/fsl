
package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.lacrisalide.service.UserService;
import com.lacrisalide.model.User;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

 private final UserService service;

 @PostMapping("/register")
 public User register(@RequestBody User u){
  return service.register(u);
 }

 @GetMapping("/hello")
 public String hello(){
  return "Backend OK";
 }
}
