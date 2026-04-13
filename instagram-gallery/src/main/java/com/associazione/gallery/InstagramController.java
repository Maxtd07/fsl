package com.associazione.gallery;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
public class InstagramController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/api/instagram/media")
    public ResponseEntity<Map> getInstagramMedia() {
        String instagramToken = System.getenv("INSTAGRAM_TOKEN");
        if (instagramToken == null || instagramToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "INSTAGRAM_TOKEN not set"));
        }

        String url = "https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink&access_token=" + instagramToken;
        try {
            Map response = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch Instagram media: " + e.getMessage()));
        }
    }
}