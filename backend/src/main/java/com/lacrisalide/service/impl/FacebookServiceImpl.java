package com.lacrisalide.service.impl;

import com.lacrisalide.dto.response.FacebookPostResponse;
import com.lacrisalide.service.FacebookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FacebookServiceImpl implements FacebookService {

    private static final Logger logger = LoggerFactory.getLogger(FacebookServiceImpl.class);

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
        
        logger.info("Fetching Facebook posts for page ID: {}", pageId);
        logger.debug("Token length: {} chars", accessToken != null ? accessToken.length() : 0);
        
        try {
            String url = String.format("%s/%s/posts?fields=%s&access_token=%s", 
                FACEBOOK_API_URL, pageId, FIELDS, accessToken);
            
            logger.debug("API Call: {}/{}/posts?fields={}&access_token=[MASKED]", 
                FACEBOOK_API_URL, pageId, FIELDS);
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            logger.info("📊 Facebook API Response: {}", response);
            
            if (response != null) {
                // Check for errors
                if (response.containsKey("error")) {
                    Map<String, Object> error = (Map<String, Object>) response.get("error");
                    logger.error("Facebook API Error: {}", error);
                    return posts;
                }
                
                if (response.containsKey("data")) {
                    List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
                    logger.info("Found {} posts", data != null ? data.size() : 0);
                    
                    if (data != null && !data.isEmpty()) {
                        for (Map<String, Object> post : data) {
                            FacebookPostResponse facebookPost = new FacebookPostResponse();
                            facebookPost.setId((String) post.get("id"));
                            facebookPost.setMessage((String) post.get("message"));
                            facebookPost.setFullPicture((String) post.get("full_picture"));
                            facebookPost.setCreatedTime((String) post.get("created_time"));
                            facebookPost.setPermalinkUrl((String) post.get("permalink_url"));
                            
                            logger.debug("Post added: {} - {}", facebookPost.getId(), facebookPost.getMessage());
                            posts.add(facebookPost);
                        }
                    } else {
                        logger.warn("No posts found. Page might be empty or require additional permissions.");
                    }
                }
            } else {
                logger.error("Facebook API returned null response");
            }
        } catch (RestClientException e) {
            logger.error("Error fetching Facebook posts: {}", e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
        }
        
        return posts;
    }
}