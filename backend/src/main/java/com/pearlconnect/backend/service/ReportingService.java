package com.pearlconnect.backend.service;

import com.pearlconnect.backend.dto.HqStatsDto;
import com.pearlconnect.backend.dto.SchoolStatsDto;
import com.pearlconnect.backend.entity.ActivityStatus;
import com.pearlconnect.backend.entity.Role;
import com.pearlconnect.backend.entity.School;
import com.pearlconnect.backend.entity.User;
import com.pearlconnect.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportingService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final ActivityRepository activityRepository;
    private final PostRepository postRepository;

    public HqStatsDto getHqStats() {
        List<User> allUsers = userRepository.findAll();

        long totalUsers = allUsers.size();
        long totalStudents = allUsers.stream().filter(u -> u.getRole() == Role.STUDENT).count();
        long totalTeachers = allUsers.stream().filter(u -> u.getRole() == Role.TEACHER).count();
        long totalSchools = schoolRepository.count();
        long totalActivities = activityRepository.count();
        long approvedActivities = activityRepository.countByStatus(ActivityStatus.APPROVED);
        long pendingActivities = activityRepository.countByStatus(ActivityStatus.PENDING);
        long totalPosts = postRepository.count();

        // School leaderboard
        List<School> schools = schoolRepository.findAll();
        List<SchoolStatsDto> leaderboard = schools.stream().map(school -> {
            List<User> students = allUsers.stream()
                    .filter(u -> u.getSchool() != null && u.getSchool().getId().equals(school.getId()) && u.getRole() == Role.STUDENT)
                    .collect(Collectors.toList());

            long studentCount = students.size();
            long totalApprovedHours = students.stream().mapToLong(u -> u.getTotalHours() != null ? u.getTotalHours() : 0).sum();
            long totalPoints = students.stream().mapToLong(u -> u.getPoints() != null ? u.getPoints() : 0).sum();

            return SchoolStatsDto.builder()
                    .schoolId(school.getId())
                    .schoolName(school.getName())
                    .studentCount(studentCount)
                    .totalApprovedHours(totalApprovedHours)
                    .totalPoints(totalPoints)
                    .build();
        })
        .sorted(Comparator.comparingLong(SchoolStatsDto::getTotalPoints).reversed())
        .collect(Collectors.toList());

        return HqStatsDto.builder()
                .totalUsers(totalUsers)
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalSchools(totalSchools)
                .totalActivities(totalActivities)
                .approvedActivities(approvedActivities)
                .pendingActivities(pendingActivities)
                .totalPosts(totalPosts)
                .schoolLeaderboard(leaderboard)
                .build();
    }
}
