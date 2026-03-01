package com.pearlconnect.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GamificationProfileDto {
    private Integer level;
    private Integer currentPoints;
    private Integer pointsForNextLevel;
    private Integer totalHours;
    private List<BadgeDto> earnedBadges;
}
