package com.pearlconnect.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ParticipationRequest {
    @NotNull(message = "Activity ID is required")
    private Long activityId;
}
