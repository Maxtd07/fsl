package com.soccerdreamfermana.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.soccerdreamfermana.dto.response.FacebookPostResponse;
import com.soccerdreamfermana.exception.BadRequestException;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

class FacebookServiceImplTest {

    @Test
    void usesDiscoveredPageTokenWhenConfiguredTokenCannotReadPosts() {
        RestTemplate restTemplate = mock(RestTemplate.class);
        FacebookServiceImpl service = new FacebookServiceImpl(restTemplate);
        ReflectionTestUtils.setField(service, "pageId", "1117449661446260");
        ReflectionTestUtils.setField(service, "accessToken", "user-token");

        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenAnswer(invocation -> {
            String url = invocation.getArgument(0, String.class);

            if (url.contains("/1117449661446260/posts") && url.contains("access_token=user-token")) {
                return facebookError("Unsupported get request");
            }
            if (url.contains("/1117449661446260/published_posts") && url.contains("access_token=user-token")) {
                return facebookError("Unsupported get request");
            }
            if (url.contains("/1117449661446260/feed") && url.contains("access_token=user-token")) {
                return facebookError("Unsupported get request");
            }
            if (url.contains("/me/accounts")) {
                return Map.of(
                    "data",
                    List.of(Map.of(
                        "id", "1117449661446260",
                        "name", "Associazione Disabili",
                        "access_token", "page-token"
                    ))
                );
            }
            if (url.contains("/1117449661446260/posts") && url.contains("access_token=page-token")) {
                return Map.of(
                    "data",
                    List.of(Map.of(
                        "id", "post-1",
                        "message", "Post pubblicato",
                        "created_time", "2026-04-17T08:00:00+0000",
                        "permalink_url", "https://facebook.example/post-1",
                        "likes", Map.of("summary", Map.of("total_count", 12)),
                        "comments", Map.of("summary", Map.of("total_count", 3))
                    ))
                );
            }

            return Map.of("data", List.of());
        });

        List<FacebookPostResponse> posts = service.getFacebookPosts();

        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).getId()).isEqualTo("post-1");
        assertThat(posts.get(0).getLikesCount()).isEqualTo(12L);
        assertThat(posts.get(0).getCommentsCount()).isEqualTo(3L);
    }

    @Test
    void fallsBackToPublishedPostsWhenPostsEdgeIsEmpty() {
        RestTemplate restTemplate = mock(RestTemplate.class);
        FacebookServiceImpl service = new FacebookServiceImpl(restTemplate);
        ReflectionTestUtils.setField(service, "pageId", "1117449661446260");
        ReflectionTestUtils.setField(service, "accessToken", "page-token");

        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenAnswer(invocation -> {
            String url = invocation.getArgument(0, String.class);

            if (url.contains("/1117449661446260/posts") && url.contains("access_token=page-token")) {
                return Map.of("data", List.of());
            }
            if (url.contains("/1117449661446260/published_posts") && url.contains("access_token=page-token")) {
                return Map.of(
                    "data",
                    List.of(Map.of(
                        "id", "post-2",
                        "message", "Post visibile da published_posts",
                        "created_time", "2026-04-17T09:00:00+0000",
                        "permalink_url", "https://facebook.example/post-2"
                    ))
                );
            }

            return Map.of("data", List.of());
        });

        List<FacebookPostResponse> posts = service.getFacebookPosts();

        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).getId()).isEqualTo("post-2");
        assertThat(posts.get(0).getMessage()).isEqualTo("Post visibile da published_posts");
    }

    @Test
    void fallsBackToSafeFieldsWhenEngagementPermissionsAreMissing() {
        RestTemplate restTemplate = mock(RestTemplate.class);
        FacebookServiceImpl service = new FacebookServiceImpl(restTemplate);
        ReflectionTestUtils.setField(service, "pageId", "1117449661446260");
        ReflectionTestUtils.setField(service, "accessToken", "page-token");

        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenAnswer(invocation -> {
            String url = invocation.getArgument(0, String.class);

            if (url.contains("/1117449661446260/posts")
                && url.contains("likes.summary(total_count).limit(0)")
                && url.contains("comments.summary(total_count).limit(0)")) {
                return facebookError("(#10) This endpoint requires the 'pages_read_engagement' permission");
            }
            if (url.contains("/1117449661446260/posts")
                && url.contains("fields=id,message,full_picture,created_time,permalink_url")) {
                return Map.of(
                    "data",
                    List.of(Map.of(
                        "id", "post-3",
                        "message", "Post visibile senza engagement",
                        "created_time", "2026-04-17T10:00:00+0000",
                        "permalink_url", "https://facebook.example/post-3",
                        "full_picture", "https://facebook.example/image.jpg"
                    ))
                );
            }

            return Map.of("data", List.of());
        });

        List<FacebookPostResponse> posts = service.getFacebookPosts();

        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).getId()).isEqualTo("post-3");
        assertThat(posts.get(0).getLikesCount()).isEqualTo(0L);
        assertThat(posts.get(0).getCommentsCount()).isEqualTo(0L);
    }

    @Test
    void throwsBadRequestWhenEveryFacebookAttemptFails() {
        RestTemplate restTemplate = mock(RestTemplate.class);
        FacebookServiceImpl service = new FacebookServiceImpl(restTemplate);
        ReflectionTestUtils.setField(service, "pageId", "1117449661446260");
        ReflectionTestUtils.setField(service, "accessToken", "broken-token");

        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenAnswer(invocation -> {
            String url = invocation.getArgument(0, String.class);

            if (url.contains("/1117449661446260/posts")) {
                return facebookError("Invalid OAuth access token");
            }
            if (url.contains("/1117449661446260/published_posts")) {
                return facebookError("Invalid OAuth access token");
            }
            if (url.contains("/1117449661446260/feed")) {
                return facebookError("Invalid OAuth access token");
            }

            return Map.of("data", List.of());
        });

        assertThatThrownBy(service::getFacebookPosts)
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Impossibile leggere i post Facebook");
    }

    private static Map<String, Object> facebookError(String message) {
        return Map.of("error", Map.of("message", message));
    }
}

