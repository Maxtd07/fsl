package com.associazionedisabili.service.impl;

import com.associazionedisabili.dto.response.FacebookPostResponse;
import com.associazionedisabili.service.FacebookService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class FacebookServiceImpl implements FacebookService {

    private static final Logger logger = LoggerFactory.getLogger(FacebookServiceImpl.class);
    private static final String FACEBOOK_API_URL = "https://graph.facebook.com/v19.0";
    private static final String POSTS_FIELDS = "id,message,full_picture,created_time,permalink_url";
    private static final String PAGES_FIELDS = "id,name,access_token";
    private static final String ME_FIELDS = "id,name";
    private static final int POST_LIMIT = 6;

    @Value("${facebook.page.id}")
    private String pageId;

    @Value("${facebook.access.token}")
    private String accessToken;

    private final RestTemplate restTemplate;

    public FacebookServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public List<FacebookPostResponse> getFacebookPosts() {
        List<FacebookPostResponse> posts = new ArrayList<>();

        if (!isConfigured(accessToken)) {
            logger.warn("Facebook access token not configured");
            return posts;
        }

        try {
            FacebookFeedTarget target = resolveFeedTarget();
            if (target == null) {
                logger.warn("Unable to resolve a Facebook page from the configured token");
                return posts;
            }

            logger.info("Fetching Facebook posts for resource {}", target.resourceId());
            Map<String, Object> response = executeGet(
                "/" + target.resourceId() + "/posts",
                POSTS_FIELDS,
                target.accessToken(),
                POST_LIMIT
            );

            List<Map<String, Object>> data = extractData(response);
            if (data.isEmpty()) {
                logger.info("No items returned by /posts, falling back to /feed for resource {}", target.resourceId());
                response = executeGet(
                    "/" + target.resourceId() + "/feed",
                    POSTS_FIELDS,
                    target.accessToken(),
                    POST_LIMIT
                );
                data = extractData(response);
            }

            logger.info("Found {} Facebook posts", data.size());

            for (Map<String, Object> post : data) {
                FacebookPostResponse facebookPost = new FacebookPostResponse();
                facebookPost.setId(asString(post.get("id")));
                facebookPost.setMessage(asString(post.get("message")));
                facebookPost.setFullPicture(asString(post.get("full_picture")));
                facebookPost.setCreatedTime(asString(post.get("created_time")));
                facebookPost.setPermalinkUrl(asString(post.get("permalink_url")));
                posts.add(facebookPost);
            }
        } catch (RestClientException e) {
            logger.error("Error fetching Facebook posts: {}", e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while fetching Facebook posts: {}", e.getMessage(), e);
        }

        return posts;
    }

    private FacebookFeedTarget resolveFeedTarget() {
        if (isConfigured(pageId)) {
            return new FacebookFeedTarget(pageId.trim(), accessToken);
        }

        List<Map<String, Object>> pages = extractData(executeGet("/me/accounts", PAGES_FIELDS, accessToken, 10));
        if (!pages.isEmpty()) {
            Map<String, Object> firstPage = pages.get(0);
            String discoveredPageId = asString(firstPage.get("id"));
            String discoveredPageToken = asString(firstPage.get("access_token"));
            if (isConfigured(discoveredPageId)) {
                String effectiveToken = isConfigured(discoveredPageToken) ? discoveredPageToken : accessToken;
                logger.info("Using Facebook page {} discovered from the provided token", discoveredPageId);
                return new FacebookFeedTarget(discoveredPageId, effectiveToken);
            }
        }

        Map<String, Object> meResponse = executeGet("/me", ME_FIELDS, accessToken, null);
        String meId = asString(meResponse.get("id"));
        if (isConfigured(meId)) {
            logger.info("Using Facebook resource {} resolved from /me", meId);
            return new FacebookFeedTarget(meId, accessToken);
        }

        return null;
    }

    private Map<String, Object> executeGet(String path, String fields, String token, Integer limit) {
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(FACEBOOK_API_URL + path)
            .queryParam("fields", fields)
            .queryParam("access_token", token);

        if (limit != null) {
            builder.queryParam("limit", limit);
        }

        logger.debug("Calling Facebook Graph API endpoint {}", path);
        Map<String, Object> response = restTemplate.getForObject(builder.toUriString(), Map.class);

        if (response == null) {
            return Collections.emptyMap();
        }

        if (response.containsKey("error")) {
            logger.error("Facebook Graph API error: {}", response.get("error"));
            return Collections.emptyMap();
        }

        return response;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> extractData(Map<String, Object> response) {
        Object data = response.get("data");
        if (data instanceof List<?> list) {
            return (List<Map<String, Object>>) list;
        }

        return Collections.emptyList();
    }

    private boolean isConfigured(String value) {
        return value != null && !value.isBlank();
    }

    private String asString(Object value) {
        return value instanceof String stringValue ? stringValue : null;
    }

    private record FacebookFeedTarget(String resourceId, String accessToken) {}
}
