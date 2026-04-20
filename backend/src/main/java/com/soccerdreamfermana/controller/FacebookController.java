package com.soccerdreamfermana.controller;

import com.soccerdreamfermana.dto.response.FacebookPostResponse;
import com.soccerdreamfermana.service.FacebookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/facebook")
public class FacebookController {
    
    private final FacebookService facebookService;
    
    public FacebookController(FacebookService facebookService) {
        this.facebookService = facebookService;
    }
    
    @GetMapping("/posts")
    public ResponseEntity<List<FacebookPostResponse>> getFacebookPosts() {
        List<FacebookPostResponse> posts = facebookService.getFacebookPosts();
        return ResponseEntity.ok(posts);
    }
}

