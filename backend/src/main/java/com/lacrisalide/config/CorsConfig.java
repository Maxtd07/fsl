
package com.lacrisalide.config;

import org.springframework.context.annotation.*;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig {
 @Bean
 public WebMvcConfigurer corsConfigurer(){
  return new WebMvcConfigurer(){
   public void addCorsMappings(CorsRegistry registry){
    registry.addMapping("/**")
     .allowedOrigins("http://localhost:3000")
     .allowedMethods("*");
   }
  };
 }
}
