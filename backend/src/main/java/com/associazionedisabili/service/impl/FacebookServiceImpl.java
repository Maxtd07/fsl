package com.associazionedisabili.service.impl;

import com.associazionedisabili.dto.response.FacebookPostResponse;
import com.associazionedisabili.service.FacebookService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
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
    private static final String POSTS_FIELDS = "id,message,full_picture,created_time,permalink_url,likes.summary(total_count).limit(0),comments.summary(total_count).limit(0)";
    private static final String PAGES_FIELDS = "id,name,access_token";
    private static final String ME_FIELDS = "id,name";
    private static final int PAGE_SIZE = 100;
    private static final int MAX_PAGES = 50;

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
            List<Map<String, Object>> data = fetchAllData(
                "/" + target.resourceId() + "/posts",
                POSTS_FIELDS,
                target.accessToken()
            );
            if (data.isEmpty()) {
                logger.info("No items returned by /posts, falling back to /feed for resource {}", target.resourceId());
                data = fetchAllData(
                    "/" + target.resourceId() + "/feed",
                    POSTS_FIELDS,
                    target.accessToken()
                );
            }

            logger.info("Found {} Facebook posts", data.size());

            for (Map<String, Object> post : data) {
                FacebookPostResponse facebookPost = new FacebookPostResponse();
                facebookPost.setId(asString(post.get("id")));
                facebookPost.setMessage(asString(post.get("message")));
                facebookPost.setFullPicture(asString(post.get("full_picture")));
                facebookPost.setCreatedTime(asString(post.get("created_time")));
                facebookPost.setPermalinkUrl(asString(post.get("permalink_url")));
                facebookPost.setLikesCount(extractCount(post.get("likes")));
                facebookPost.setCommentsCount(extractCount(post.get("comments")));
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

    private List<Map<String, Object>> fetchAllData(String path, String fields, String token) {
        List<Map<String, Object>> results = new ArrayList<>();
        String nextUrl = buildUrl(path, fields, token, PAGE_SIZE);
        int pageCount = 0;

        while (isConfigured(nextUrl) && pageCount < MAX_PAGES) {
            pageCount++;
            Map<String, Object> response = executeGetByUrl(nextUrl);
            results.addAll(extractData(response));
            nextUrl = extractNextUrl(response);
        }

        if (pageCount == MAX_PAGES && isConfigured(nextUrl)) {
            logger.warn("Facebook pagination stopped after {} pages to avoid unbounded requests", MAX_PAGES);
        }

        return deduplicateById(results);
    }

    private Map<String, Object> executeGet(String path, String fields, String token, Integer limit) {
        logger.debug("Calling Facebook Graph API endpoint {}", path);
        return executeGetByUrl(buildUrl(path, fields, token, limit));
    }

    private Map<String, Object> executeGetByUrl(String url) {
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null) {
            return Collections.emptyMap();
        }

        if (response.containsKey("error")) {
            logger.error("Facebook Graph API error: {}", response.get("error"));
            return Collections.emptyMap();
        }

        return response;
    }

    private String buildUrl(String path, String fields, String token, Integer limit) {
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(FACEBOOK_API_URL + path)
            .queryParam("fields", fields)
            .queryParam("access_token", token);

        if (limit != null) {
            builder.queryParam("limit", limit);
        }

        return builder.toUriString();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> extractData(Map<String, Object> response) {
        Object data = response.get("data");
        if (data instanceof List<?> list) {
            return (List<Map<String, Object>>) list;
        }

        return Collections.emptyList();
    }

    @SuppressWarnings("unchecked")
    private String extractNextUrl(Map<String, Object> response) {
        Object paging = response.get("paging");
        if (paging instanceof Map<?, ?> pagingMap) {
            Object next = ((Map<String, Object>) pagingMap).get("next");
            return next instanceof String nextUrl ? nextUrl : null;
        }

        return null;
    }

    private List<Map<String, Object>> deduplicateById(List<Map<String, Object>> items) {
        Map<String, Map<String, Object>> uniqueItems = new LinkedHashMap<>();
        for (Map<String, Object> item : items) {
            String id = asString(item.get("id"));
            if (isConfigured(id)) {
                uniqueItems.putIfAbsent(id, item);
            }
        }

        return new ArrayList<>(uniqueItems.values());
    }

    private boolean isConfigured(String value) {
        return value != null && !value.isBlank();
    }

    private String asString(Object value) {
        return value instanceof String stringValue ? stringValue : null;
    }

    @SuppressWarnings("unchecked")
    private Long extractCount(Object value) {
        if (value instanceof Map<?, ?> map) {
            Map<String, Object> mapValue = (Map<String, Object>) map;
            Object summary = mapValue.get("summary");
            if (summary instanceof Map<?, ?> summaryMap) {
                Object count = ((Map<String, Object>) summaryMap).get("total_count");
                if (count instanceof Integer intCount) {
                    return (long) intCount;
                } else if (count instanceof Long longCount) {
                    return longCount;
                }
            }
        }
        return 0L;
    }

    private record FacebookFeedTarget(String resourceId, String accessToken) {}
}
