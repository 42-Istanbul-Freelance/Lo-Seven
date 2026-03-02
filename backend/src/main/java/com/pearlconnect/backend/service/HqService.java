package com.pearlconnect.backend.service;

import com.pearlconnect.backend.dto.SchoolStatsDto;
import com.pearlconnect.backend.entity.ActivityStatus;
import com.pearlconnect.backend.entity.Role;
import com.pearlconnect.backend.entity.School;
import com.pearlconnect.backend.repository.ActivityRepository;
import com.pearlconnect.backend.repository.SchoolRepository;
import com.pearlconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HqService {

    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public List<SchoolStatsDto> getAllSchoolsStats() {
        List<School> schools = schoolRepository.findAll();

        return schools.stream().map(school -> {
            Long schoolId = school.getId();

            // Get student count
            Long studentCount = userRepository.countBySchoolIdAndRole(schoolId, Role.STUDENT);

            // Get teacher count
            Long teacherCount = userRepository.countBySchoolIdAndRole(schoolId, Role.TEACHER);

            // Get total approved hours
            Long approvedHours = activityRepository.getSumOfApprovedHoursBySchoolId(schoolId, ActivityStatus.APPROVED);

            // Get total points
            Long totalPoints = userRepository.getSumOfPointsBySchoolId(schoolId);

            return SchoolStatsDto.builder()
                    .schoolId(schoolId)
                    .schoolName(school.getName())
                    .studentCount(studentCount)
                    .teacherCount(teacherCount)
                    .totalApprovedHours(approvedHours)
                    .totalPoints(totalPoints)
                    .build();
        }).collect(Collectors.toList());
    }
}
