package com.soccerdreamfermana.service.impl;

import com.soccerdreamfermana.dto.response.FacebookPostResponse;
import com.soccerdreamfermana.exception.BadRequestException;
import com.soccerdreamfermana.service.FacebookService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class FacebookServiceImpl implements FacebookService {

    private static final Logger logger = LoggerFactory.getLogger(FacebookServiceImpl.class);
    private static final String FACEBOOK_API_URL = "https://graph.facebook.com/v19.0";
    private static final String POSTS_FIELDS = "id,message,full_picture,created_time,permalink_url,likes.summary(total_count).limit(0),comments.summary(total_count).limit(0)";
    private static final String SAFE_POSTS_FIELDS = "id,message,full_picture,created_time,permalink_url";
    private static final String PAGES_FIELDS = "id,name,access_token";
    private static final String ME_FIELDS = "id,name";
    private static final List<String> POSTS_ENDPOINTS = List.of("/posts", "/published_posts", "/feed");
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
            List<FacebookFeedTarget> targets = resolveFeedTargets();
            if (targets.isEmpty()) {
                logger.warn("Unable to resolve a Facebook page from the configured token");
                return posts;
            }

            List<String> failures = new ArrayList<>();
            List<Map<String, Object>> data = Collections.emptyList();

            for (FacebookFeedTarget target : targets) {
                logger.info("Fetching Facebook posts for resource {} using {}", target.resourceId(), target.source());
                try {
                    data = fetchPostsForTarget(target);
                } catch (FacebookApiException e) {
                    failures.add(e.getMessage());
                    logger.warn(
                        "Facebook fetch failed for resource {} using {}: {}",
                        target.resourceId(),
                        target.source(),
                        e.getMessage()
                    );
                    continue;
                }

                if (!data.isEmpty()) {
                    break;
                }
            }

            if (data.isEmpty() && !failures.isEmpty()) {
                throw new BadRequestException(
                    "Impossibile leggere i post Facebook. Verifica token pagina, ID pagina e permessi pages_show_list/pages_read_engagement/pages_read_user_content."
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
        } catch (BadRequestException e) {
            throw e;
        } catch (RestClientException e) {
            logger.error("Error fetching Facebook posts: {}", e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while fetching Facebook posts: {}", e.getMessage(), e);
        }

        return posts;
    }

    private List<FacebookFeedTarget> resolveFeedTargets() {
        List<FacebookFeedTarget> targets = new ArrayList<>();
        Set<String> seenTargets = new HashSet<>();

        if (isConfigured(pageId)) {
            addTarget(targets, seenTargets, pageId.trim(), accessToken, "configured page id");
        }

        List<Map<String, Object>> pages = readManagedPages();
        if (!pages.isEmpty()) {
            pages.stream()
                .sorted(Comparator.comparing(page -> isMatchingConfiguredPage(page) ? 0 : 1))
                .forEach(page -> {
                    String discoveredPageId = asString(page.get("id"));
                    String discoveredPageToken = asString(page.get("access_token"));
                    String effectiveToken = isConfigured(discoveredPageToken) ? discoveredPageToken : accessToken;
                    String source = isMatchingConfiguredPage(page)
                        ? "page token discovered from /me/accounts"
                        : "page discovered from /me/accounts";
                    addTarget(targets, seenTargets, discoveredPageId, effectiveToken, source);
                });
        }

        if (!isConfigured(pageId)) {
            try {
                Map<String, Object> meResponse = executeGet("/me", ME_FIELDS, accessToken, null);
                String meId = asString(meResponse.get("id"));
                if (isConfigured(meId)) {
                    addTarget(targets, seenTargets, meId, accessToken, "resource resolved from /me");
                }
            } catch (FacebookApiException e) {
                logger.warn("Unable to resolve Facebook /me resource: {}", e.getMessage());
            }
        }

        return targets;
    }

    private List<Map<String, Object>> fetchPostsForTarget(FacebookFeedTarget target) {
        FacebookApiException lastError = null;

        for (String endpoint : POSTS_ENDPOINTS) {
            try {
                List<Map<String, Object>> data = fetchEndpointWithFallback(target, endpoint);
                if (!data.isEmpty()) {
                    return data;
                }
                logger.info("No items returned by {} for resource {}", endpoint, target.resourceId());
            } catch (FacebookApiException e) {
                lastError = e;
                logger.info(
                    "Endpoint {} unavailable for resource {} using {}: {}",
                    endpoint,
                    target.resourceId(),
                    target.source(),
                    e.getMessage()
                );
            }
        }

        if (lastError != null) {
            throw lastError;
        }

        return Collections.emptyList();
    }

    private List<Map<String, Object>> fetchEndpointWithFallback(FacebookFeedTarget target, String endpoint) {
        String path = "/" + target.resourceId() + endpoint;

        try {
            return fetchAllData(path, POSTS_FIELDS, target.accessToken());
        } catch (FacebookApiException e) {
            if (!requiresEngagementPermission(e)) {
                throw e;
            }

            logger.info(
                "Engagement fields unavailable for {} using {}. Falling back to safe post fields.",
                path,
                target.source()
            );
            return fetchAllData(path, SAFE_POSTS_FIELDS, target.accessToken());
        }
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
        Map<String, Object> response;
        try {
            response = restTemplate.getForObject(url, Map.class);
        } catch (RestClientResponseException e) {
            throw new FacebookApiException(e.getResponseBodyAsString(), e);
        } catch (RestClientException e) {
            throw new FacebookApiException(e.getMessage(), e);
        }

        if (response == null) {
            return Collections.emptyMap();
        }

        if (response.containsKey("error")) {
            throw new FacebookApiException(extractErrorMessage(response));
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

    private List<Map<String, Object>> readManagedPages() {
        try {
            return extractData(executeGet("/me/accounts", PAGES_FIELDS, accessToken, 25));
        } catch (FacebookApiException e) {
            logger.info("Unable to inspect /me/accounts with the configured token: {}", e.getMessage());
            return Collections.emptyList();
        }
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

    private void addTarget(
        List<FacebookFeedTarget> targets,
        Set<String> seenTargets,
        String resourceId,
        String token,
        String source
    ) {
        if (!isConfigured(resourceId) || !isConfigured(token)) {
            return;
        }

        String normalizedId = resourceId.trim();
        String signature = normalizedId + "|" + token.trim();
        if (seenTargets.add(signature)) {
            targets.add(new FacebookFeedTarget(normalizedId, token.trim(), source));
        }
    }

    private boolean isMatchingConfiguredPage(Map<String, Object> page) {
        String configuredPageId = isConfigured(pageId) ? pageId.trim() : null;
        return configuredPageId != null && configuredPageId.equals(asString(page.get("id")));
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

    @SuppressWarnings("unchecked")
    private String extractErrorMessage(Map<String, Object> response) {
        Object error = response.get("error");
        if (error instanceof Map<?, ?> errorMap) {
            Object message = ((Map<String, Object>) errorMap).get("message");
            if (message instanceof String messageText && !messageText.isBlank()) {
                return messageText;
            }
        }

        return "Facebook Graph API error";
    }

    private boolean requiresEngagementPermission(FacebookApiException error) {
        String message = error.getMessage();
        if (!isConfigured(message)) {
            return false;
        }

        return message.contains("pages_read_engagement")
            || message.contains("Page Public Content Access");
    }

    private record FacebookFeedTarget(String resourceId, String accessToken, String source) {}

    private static class FacebookApiException extends RuntimeException {
        private FacebookApiException(String message) {
            super(message);
        }

        private FacebookApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}

