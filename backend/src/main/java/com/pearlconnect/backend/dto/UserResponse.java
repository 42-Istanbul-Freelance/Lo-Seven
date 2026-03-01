package com.pearlconnect.backend.dto;

import com.pearlconnect.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private Integer level;
    private Integer points;
    private Integer totalHours;
    private Long schoolId;
    private LocalDateTime createdAt;
    private String profilePictureUrl;
}
