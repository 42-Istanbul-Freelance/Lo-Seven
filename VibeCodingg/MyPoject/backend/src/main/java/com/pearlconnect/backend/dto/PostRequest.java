package com.pearlconnect.backend.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String content;
    private String mediaUrl;
    // Optional: if the post is linked to an activity
    private Long activityId;
}
