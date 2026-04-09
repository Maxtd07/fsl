
package com.lacrisalide;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LacrisalideBackendApplication {

 public static void main(String[] args) {
  SpringApplication.run(LacrisalideBackendApplication.class, args);
 }

}
