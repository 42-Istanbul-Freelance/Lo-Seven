package com.pearlconnect.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GamificationProfileDto {
    private Integer level;
    private Integer currentPoints;
    private Integer pointsForNextLevel; // e.g., 100 for level 2, 200 for level 3
    private List<BadgeDto> earnedBadges;
}
