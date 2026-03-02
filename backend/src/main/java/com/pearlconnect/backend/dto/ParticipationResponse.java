package com.pearlconnect.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ParticipationResponse {
    private Long id;
    private Long activityId;
    private Long studentId;
    private String studentName;
    private String mediaUrl;
    private String comment;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
