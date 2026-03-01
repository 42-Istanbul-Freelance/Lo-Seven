package com.pearlconnect.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class HqStatsDto {
    private Long totalUsers;
    private Long totalStudents;
    private Long totalTeachers;
    private Long totalSchools;
    private Long totalActivities;
    private Long approvedActivities;
    private Long pendingActivities;
    private Long totalPosts;
    private List<SchoolStatsDto> schoolLeaderboard;
}
