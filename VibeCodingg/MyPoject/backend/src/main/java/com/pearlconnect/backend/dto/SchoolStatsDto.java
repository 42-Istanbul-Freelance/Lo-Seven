package com.pearlconnect.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SchoolStatsDto {
    private Long schoolId;
    private String schoolName;
    private Long studentCount;
    private Long totalApprovedHours;
    private Long totalPoints;
}
