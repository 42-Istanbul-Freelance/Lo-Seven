package com.pearlconnect.backend.service;

import com.pearlconnect.backend.dto.BadgeDto;
import com.pearlconnect.backend.dto.GamificationProfileDto;
import com.pearlconnect.backend.entity.Badge;
import com.pearlconnect.backend.entity.User;
import com.pearlconnect.backend.entity.UserBadge;
import com.pearlconnect.backend.repository.BadgeRepository;
import com.pearlconnect.backend.repository.UserBadgeRepository;
import com.pearlconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;

    // Constants for Points
    private static final int POINTS_PER_HOUR = 50;
    private static final int POINTS_PER_POST = 5;
    private static final int POINTS_PER_LIKE_RECEIVED = 1;

    public void awardPointsForActivity(Long userId, int hours) {
        awardPoints(userId, hours * POINTS_PER_HOUR);
    }

    public void awardPointsForPost(Long userId) {
        awardPoints(userId, POINTS_PER_POST);
    }

    public void awardPointsForLike(Long userId) {
        awardPoints(userId, POINTS_PER_LIKE_RECEIVED);
    }

    private void awardPoints(Long userId, int pointsToAdd) {
        User user = userRepository.findById(userId).orElseThrow();
        
        int currentPoints = user.getPoints() != null ? user.getPoints() : 0;
        int newPoints = currentPoints + pointsToAdd;
        user.setPoints(newPoints);

        // Simple Level Logic: 100 points = 1 level
        int newLevel = (newPoints / 100) + 1;
        if (newLevel > (user.getLevel() != null ? user.getLevel() : 1)) {
            user.setLevel(newLevel);
        }

        userRepository.save(user);

        // Check for new badges
        checkAndAwardBadges(user);
    }

    private void checkAndAwardBadges(User user) {
        List<Badge> allBadges = badgeRepository.findAll();
        for (Badge badge : allBadges) {
            if (user.getPoints() >= badge.getRequiredPoints()) {
                boolean alreadyHasBadge = userBadgeRepository.existsByUserIdAndBadgeId(user.getId(), badge.getId());
                if (!alreadyHasBadge) {
                    UserBadge newAward = UserBadge.builder()
                            .user(user)
                            .badge(badge)
                            .build();
                    userBadgeRepository.save(newAward);
                }
            }
        }
    }

    public GamificationProfileDto getGamificationProfile(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        
        int currentPoints = user.getPoints() != null ? user.getPoints() : 0;
        int currentLevel = user.getLevel() != null ? user.getLevel() : 1;
        int pointsForNextLevel = currentLevel * 100;
        
        List<BadgeDto> earnedBadges = userBadgeRepository.findByUserIdOrderByEarnedAtDesc(userId)
                .stream()
                .map(ub -> BadgeDto.builder()
                        .id(ub.getBadge().getId())
                        .name(ub.getBadge().getName())
                        .description(ub.getBadge().getDescription())
                        .iconUrl(ub.getBadge().getIconUrl())
                        .earnedAt(ub.getEarnedAt())
                        .build())
                .collect(Collectors.toList());
                
        return GamificationProfileDto.builder()
                .level(currentLevel)
                .currentPoints(currentPoints)
                .pointsForNextLevel(pointsForNextLevel)
                .earnedBadges(earnedBadges)
                .build();
    }
}
