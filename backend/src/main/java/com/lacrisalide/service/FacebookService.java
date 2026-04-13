package com.lacrisalide.service;

import com.lacrisalide.dto.response.FacebookPostResponse;
import java.util.List;

public interface FacebookService {
    List<FacebookPostResponse> getFacebookPosts();
}