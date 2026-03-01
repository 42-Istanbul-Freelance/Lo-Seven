package com.pearlconnect.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BadgeDto {
    private Long id;
    private String name;
    private String description;
    private String iconUrl;
    private LocalDateTime earnedAt;
}
