package com.associazionedisabili.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacebookPostResponse {
    private String id;
    private String message;
    private String fullPicture;
    private String createdTime;
    private String permalinkUrl;
    private Long likesCount;
    private Long commentsCount;
}
