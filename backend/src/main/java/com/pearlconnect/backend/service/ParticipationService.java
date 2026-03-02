package com.pearlconnect.backend.service;

import com.pearlconnect.backend.dto.ParticipationCompleteRequest;
import com.pearlconnect.backend.dto.ParticipationRequest;
import com.pearlconnect.backend.dto.ParticipationResponse;
import com.pearlconnect.backend.entity.*;
import com.pearlconnect.backend.repository.ActivityRepository;
import com.pearlconnect.backend.repository.ParticipationRepository;
import com.pearlconnect.backend.repository.UserRepository;
import com.pearlconnect.backend.dto.PostRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;
    private final NotificationService notificationService;
    private final PostService postService;

    public ParticipationResponse participateInActivity(Long studentId, ParticipationRequest request) {
        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (activity.getStatus() != ActivityStatus.APPROVED) {
            throw new RuntimeException("Cannot participate in an unapproved activity");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (participationRepository.findByActivityIdAndStudentId(activity.getId(), student.getId()).isPresent()) {
            throw new RuntimeException("Student is already registered for this activity");
        }

        Participation participation = Participation.builder()
                .activity(activity)
                .student(student)
                .status(ParticipationStatus.REGISTERED)
                .build();

        return mapToDto(participationRepository.save(participation));
    }

    public ParticipationResponse completeParticipation(Long participationId, Long studentId,
            ParticipationCompleteRequest request) {
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Participation not found"));

        if (!participation.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You can only complete your own participation");
        }

        if (participation.getStatus() == ParticipationStatus.COMPLETED) {
            throw new RuntimeException("Participation is already completed");
        }

        participation.setStatus(ParticipationStatus.COMPLETED);
        participation.setMediaUrl(request.getMediaUrl());
        participation.setComment(request.getComment());
        participation.setCompletedAt(LocalDateTime.now());

        Participation savedParticipation = participationRepository.save(participation);

        // Earn XP & update hours
        Activity activity = participation.getActivity();
        User student = participation.getStudent();

        student.setTotalHours(
                student.getTotalHours() != null ? student.getTotalHours() + activity.getHours() : activity.getHours());
        userRepository.save(student);

        gamificationService.awardPointsForActivity(student.getId(), activity.getHours());

        // Also if they posted media, they get 5 extra points for the post
        if (request.getMediaUrl() != null && !request.getMediaUrl().isEmpty()) {
            // Award points for post in PostService (called internally in createPost), so we
            // skip extra here

            // Generate Community Format string
            String postContent = String.format("%s, %s etkinliğindeydi!",
                    student.getFirstName() + " " + student.getLastName(),
                    activity.getTitle());

            // Create PostRequest
            PostRequest postRequest = new PostRequest();
            postRequest.setContent(postContent);
            postRequest.setMediaUrl(request.getMediaUrl());
            postRequest.setActivityId(activity.getId());

            // Create Post
            postService.createPost(postRequest, student.getId());
        }

        return mapToDto(savedParticipation);
    }

    public List<ParticipationResponse> getMyParticipations(Long studentId) {
        return participationRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ParticipationResponse> getActivityParticipations(Long activityId) {
        return participationRepository.findByActivityId(activityId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ParticipationResponse mapToDto(Participation participation) {
        return ParticipationResponse.builder()
                .id(participation.getId())
                .activityId(participation.getActivity().getId())
                .studentId(participation.getStudent().getId())
                .studentName(participation.getStudent().getFirstName() + " " + participation.getStudent().getLastName())
                .mediaUrl(participation.getMediaUrl())
                .comment(participation.getComment())
                .status(participation.getStatus().name())
                .createdAt(participation.getCreatedAt())
                .completedAt(participation.getCompletedAt())
                .build();
    }
}
