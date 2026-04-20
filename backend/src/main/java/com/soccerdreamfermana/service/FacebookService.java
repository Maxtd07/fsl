package com.soccerdreamfermana.service;

import com.soccerdreamfermana.dto.response.FacebookPostResponse;
import java.util.List;

public interface FacebookService {
    List<FacebookPostResponse> getFacebookPosts();
}

