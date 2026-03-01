package com.pearlconnect.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Total approved volunteer hours
    @Column(name = "total_hours", columnDefinition = "integer default 0")
    @Builder.Default
    private Integer totalHours = 0;

    // Gamification points (XP)
    @Column(columnDefinition = "integer default 0")
    @Builder.Default
    private Integer points = 0;

    // Gamification level
    @Column(columnDefinition = "integer default 1")
    @Builder.Default
    private Integer level = 1;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
