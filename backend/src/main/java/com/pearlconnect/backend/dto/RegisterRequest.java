package com.pearlconnect.backend.dto;

import com.pearlconnect.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String firstName;

    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role;

    private Long schoolId;

    // For PRINCIPAL registration – creates a new school
    private String schoolName;
    private String schoolType;
}
