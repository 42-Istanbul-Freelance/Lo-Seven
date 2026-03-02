package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.dto.UserResponse;
import com.pearlconnect.backend.entity.Role;
import com.pearlconnect.backend.entity.User;
import com.pearlconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapToDto(user));
    }

    @GetMapping("/{userId}/connections")
    public ResponseEntity<Map<String, List<UserResponse>>> getUserConnections(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, List<UserResponse>> connections = new java.util.HashMap<>();

        if (user.getRole() == Role.STUDENT) {
            if (user.getSchool() != null) {
                List<UserResponse> teachers = userRepository
                        .findBySchoolIdAndRole(user.getSchool().getId(), Role.TEACHER)
                        .stream().map(this::mapToDto).collect(Collectors.toList());
                connections.put("TEACHERS", teachers);

                List<UserResponse> peers = userRepository.findBySchoolIdAndRole(user.getSchool().getId(), Role.STUDENT)
                        .stream()
                        .filter(u -> !u.getId().equals(user.getId()))
                        .map(this::mapToDto).collect(Collectors.toList());
                connections.put("STUDENTS", peers);
            }
        } else if (user.getRole() == Role.TEACHER) {
            if (user.getSchool() != null) {
                List<UserResponse> students = userRepository
                        .findBySchoolIdAndRole(user.getSchool().getId(), Role.STUDENT)
                        .stream().map(this::mapToDto).collect(Collectors.toList());
                connections.put("STUDENTS", students);

                List<UserResponse> schools = userRepository
                        .findBySchoolIdAndRole(user.getSchool().getId(), Role.PRINCIPAL)
                        .stream().map(this::mapToDto).collect(Collectors.toList());
                connections.put("SCHOOL", schools);
            }
        } else if (user.getRole() == Role.PRINCIPAL) {
            List<UserResponse> hq = userRepository.findByRole(Role.HQ)
                    .stream().map(this::mapToDto).collect(Collectors.toList());
            connections.put("HQ", hq);
        }

        return ResponseEntity.ok(connections);
    }

    @GetMapping
    @PreAuthorize("hasRole('HQ')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/{userId}/role")
    @PreAuthorize("hasRole('HQ')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Role newRole = Role.valueOf(payload.get("role").toUpperCase());
            user.setRole(newRole);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User role updated to " + newRole.name()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role specified."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/me/profile-picture")
    public ResponseEntity<?> updateProfilePicture(@RequestBody Map<String, String> payload,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.pearlconnect.backend.security.CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        String newUrl = payload.get("profilePictureUrl");
        if (newUrl == null || newUrl.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "profilePictureUrl is required."));
        }

        try {
            User user = userRepository.findById(userDetails.getId()).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            user.setProfilePictureUrl(newUrl);
            userRepository.save(user);

            return ResponseEntity
                    .ok(Map.of("message", "Profile picture updated successfully", "profilePictureUrl", newUrl));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    private UserResponse mapToDto(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .level(user.getLevel())
                .points(user.getPoints())
                .totalHours(user.getTotalHours())
                .schoolId(user.getSchool() != null ? user.getSchool().getId() : null)
                .createdAt(user.getCreatedAt())
                .profilePictureUrl(user.getProfilePictureUrl())
                .build();
    }
}
