package com.pearlconnect.backend.service;

import com.pearlconnect.backend.dto.ActivityRequest;
import com.pearlconnect.backend.dto.ActivityResponse;
import com.pearlconnect.backend.entity.Activity;
import com.pearlconnect.backend.entity.ActivityStatus;
import com.pearlconnect.backend.entity.User;
import com.pearlconnect.backend.repository.ActivityRepository;
import com.pearlconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

        private final ActivityRepository activityRepository;
        private final UserRepository userRepository;
        private final NotificationService notificationService;

        public ActivityResponse createActivity(ActivityRequest request, Long studentId) {
                User student = userRepository.findById(studentId)
                                .orElseThrow(() -> new RuntimeException("Student not found"));

                Activity activity = Activity.builder()
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .hours(request.getHours())
                                .mediaUrl(request.getMediaUrl())
                                .eventDate(request.getEventDate())
                                .student(student)
                                .status(ActivityStatus.PENDING)
                                .build();

                Activity savedActivity = activityRepository.save(activity);
                return mapToDto(savedActivity);
        }

        public List<ActivityResponse> getStudentActivities(Long studentId) {
                return activityRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        public List<ActivityResponse> getPendingActivitiesForSchool(Long schoolId) {
                return activityRepository
                                .findByStudentSchoolIdAndStatusOrderByCreatedAtAsc(schoolId, ActivityStatus.PENDING)
                                .stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        public List<ActivityResponse> getApprovedActivitiesForSchool(Long schoolId) {
                return activityRepository
                                .findByStudentSchoolIdAndStatusOrderByCreatedAtAsc(schoolId, ActivityStatus.APPROVED)
                                .stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        public ActivityResponse approveActivity(Long activityId, Long approverId) {
                Activity activity = activityRepository.findById(activityId)
                                .orElseThrow(() -> new RuntimeException("Activity not found"));
                User approver = userRepository.findById(approverId)
                                .orElseThrow(() -> new RuntimeException("Approver not found"));

                if (activity.getStatus() != ActivityStatus.PENDING) {
                        throw new RuntimeException("Activity is not in PENDING state");
                }

                activity.setStatus(ActivityStatus.APPROVED);
                activity.setApprover(approver);
                activity.setApprovedAt(LocalDateTime.now());

                User student = activity.getStudent();

                // Notify the student
                String approverName = approver.getFirstName() + " " + approver.getLastName();
                notificationService.createNotification(
                                student.getId(),
                                "ACTIVITY_APPROVED",
                                "Your activity \"" + activity.getTitle() + "\" has been approved by " + approverName,
                                approverName,
                                activityId);

                return mapToDto(activityRepository.save(activity));
        }

        public ActivityResponse rejectActivity(Long activityId, Long approverId) {
                Activity activity = activityRepository.findById(activityId)
                                .orElseThrow(() -> new RuntimeException("Activity not found"));
                User approver = userRepository.findById(approverId)
                                .orElseThrow(() -> new RuntimeException("Approver not found"));

                if (activity.getStatus() != ActivityStatus.PENDING) {
                        throw new RuntimeException("Activity is not in PENDING state");
                }

                activity.setStatus(ActivityStatus.REJECTED);
                activity.setApprover(approver);
                activity.setApprovedAt(LocalDateTime.now());

                // Notify the student
                String approverName = approver.getFirstName() + " " + approver.getLastName();
                notificationService.createNotification(
                                activity.getStudent().getId(),
                                "ACTIVITY_REJECTED",
                                "Your activity \"" + activity.getTitle() + "\" has been rejected by " + approverName,
                                approverName,
                                activityId);

                return mapToDto(activityRepository.save(activity));
        }

        private ActivityResponse mapToDto(Activity activity) {
                return ActivityResponse.builder()
                                .id(activity.getId())
                                .title(activity.getTitle())
                                .description(activity.getDescription())
                                .hours(activity.getHours())
                                .mediaUrl(activity.getMediaUrl())
                                .status(activity.getStatus())
                                .eventDate(activity.getEventDate())
                                .studentId(activity.getStudent().getId())
                                .studentName(activity.getStudent().getFirstName() + " "
                                                + activity.getStudent().getLastName())
                                .approverId(activity.getApprover() != null ? activity.getApprover().getId() : null)
                                .approverName(activity.getApprover() != null ? activity.getApprover().getFirstName()
                                                + " " + activity.getApprover().getLastName() : null)
                                .createdAt(activity.getCreatedAt())
                                .approvedAt(activity.getApprovedAt())
                                .build();
        }
}
