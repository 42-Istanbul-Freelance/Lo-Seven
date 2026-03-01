package com.pearlconnect.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String content;
    private String mediaUrl;
    private Long authorId;
    private String authorName;
    private Long activityId;
    private Integer likesCount;
    private boolean isLikedByCurrentUser;
    private List<CommentResponse> comments;
    private LocalDateTime createdAt;
}
