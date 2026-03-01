package com.pearlconnect.backend.dto;

import com.pearlconnect.backend.entity.ActivityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityResponse {
    private Long id;
    private String title;
    private String description;
    private Integer hours;
    private String mediaUrl;
    private ActivityStatus status;
    private Long studentId;
    private String studentName;
    private Long approverId;
    private String approverName;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
}
