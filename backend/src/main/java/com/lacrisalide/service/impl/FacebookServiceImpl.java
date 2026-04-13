package com.lacrisalide.service.impl;

import com.lacrisalide.dto.response.FacebookPostResponse;
import com.lacrisalide.service.FacebookService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FacebookServiceImpl implements FacebookService {

    @Value("${facebook.page.id}")
    private String pageId;

    @Value("${facebook.access.token}")
    private String accessToken;

    private final RestTemplate restTemplate;
    private static final String FACEBOOK_API_URL = "https://graph.facebook.com/v19.0";
    private static final String FIELDS = "id,message,full_picture,created_time,permalink_url";

    public FacebookServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public List<FacebookPostResponse> getFacebookPosts() {
        List<FacebookPostResponse> posts = new ArrayList<>();
        
        try {
            String url = String.format("%s/%s/posts?fields=%s&access_token=%s", 
                FACEBOOK_API_URL, pageId, FIELDS, accessToken);
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null && response.containsKey("data")) {
                List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
                
                if (data != null) {
                    for (Map<String, Object> post : data) {
                        FacebookPostResponse facebookPost = new FacebookPostResponse();
                        facebookPost.setId((String) post.get("id"));
                        facebookPost.setMessage((String) post.get("message"));
                        facebookPost.setFullPicture((String) post.get("full_picture"));
                        facebookPost.setCreatedTime((String) post.get("created_time"));
                        facebookPost.setPermalinkUrl((String) post.get("permalink_url"));
                        
                        posts.add(facebookPost);
                    }
                }
            }
        } catch (RestClientException e) {
            System.err.println("Error fetching Facebook posts: " + e.getMessage());
        }
        
        return posts;
    }
}