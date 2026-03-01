package com.pearlconnect.backend.repository;

import com.pearlconnect.backend.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUserIdOrderByEarnedAtDesc(Long userId);
    boolean existsByUserIdAndBadgeId(Long userId, Long badgeId);
}
