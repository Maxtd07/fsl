
package com.lacrisalide.email;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

 public void sendConfirmation(String email){
  System.out.println("Email confirmation sent to " + email);
 }

}
