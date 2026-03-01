package com.pearlconnect.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String type;
    private String message;
    private String actorName;
    private Long referenceId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
