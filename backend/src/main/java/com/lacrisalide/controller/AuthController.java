
package com.lacrisalide.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import com.lacrisalide.service.UserService;
import com.lacrisalide.model.User;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

 private final UserService service;

 @PostMapping("/register")
 public User register(@RequestBody User u){
  return service.register(u);
 }

 @PostMapping("/login")
 public ResponseEntity<?> login(@RequestBody Map<String, String> credentials){
  String username = credentials.get("username");
  String password = credentials.get("password");
  
  User user = service.authenticate(username, password);
  
  if(user != null) {
   Map<String, String> response = new HashMap<>();
   response.put("token", "Bearer " + user.getId() + "_" + System.currentTimeMillis());
   response.put("admin", user.getNome());
   return ResponseEntity.ok(response);
  }
  
  return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
 }

 @GetMapping("/hello")
 public String hello(){
  return "Backend OK";
 }
}
