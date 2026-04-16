package com.associazionedisabili.service;

import com.associazionedisabili.dto.response.FacebookPostResponse;
import java.util.List;

public interface FacebookService {
    List<FacebookPostResponse> getFacebookPosts();
}
