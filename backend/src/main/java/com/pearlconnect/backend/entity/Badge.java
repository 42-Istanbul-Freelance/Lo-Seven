package com.pearlconnect.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    private String iconUrl; // emoji or public image URL

    @Column(name = "required_points", nullable = false)
    private Integer requiredPoints;

    // NEW: Hour-based threshold for Pearl badges
    @Column(name = "required_hours")
    @Builder.Default
    private Integer requiredHours = 0;
}
