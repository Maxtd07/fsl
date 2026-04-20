
package com.soccerdreamfermana;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
 public static void main(String[] args) {
  loadEnvFrom(".");
  loadEnvFrom("..");
  loadEnvFrom("backend");
  SpringApplication.run(Application.class, args);
 }

 private static void loadEnvFrom(String directory) {
  Dotenv dotenv = Dotenv.configure()
   .directory(directory)
   .ignoreIfMissing()
   .load();

  dotenv.entries().forEach(entry -> {
   if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
    System.setProperty(entry.getKey(), entry.getValue());
   }
  });
 }
}

