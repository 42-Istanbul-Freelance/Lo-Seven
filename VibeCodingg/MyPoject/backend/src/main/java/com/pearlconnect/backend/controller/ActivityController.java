package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.dto.ActivityRequest;
import com.pearlconnect.backend.dto.ActivityResponse;
import com.pearlconnect.backend.security.CustomUserDetails;
import com.pearlconnect.backend.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    // Student adds new activity
    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(
            @Valid @RequestBody ActivityRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(activityService.createActivity(request, userDetails.getId()));
    }

    // Student views their own activities
    @GetMapping("/my")
    public ResponseEntity<List<ActivityResponse>> getMyActivities(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(activityService.getStudentActivities(userDetails.getId()));
    }

    // Teacher/Principal views pending activities for their school
    @GetMapping("/pending")
    public ResponseEntity<List<ActivityResponse>> getPendingActivities(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Here we assume the approver is linked to a school
        if (userDetails.getUser().getSchool() == null && !userDetails.getUser().getRole().name().equals("HQ")) {
            return ResponseEntity.badRequest().build();
        }
        
        Long schoolId = userDetails.getUser().getSchool() != null ? userDetails.getUser().getSchool().getId() : null;
        
        if (schoolId == null) {
            // For HQ or if no school linked, maybe return all pending. Kept simple for now.
            return ResponseEntity.ok(List.of()); 
        }

        return ResponseEntity.ok(activityService.getPendingActivitiesForSchool(schoolId));
    }

    // Approver approves activity
    @PostMapping("/{id}/approve")
    public ResponseEntity<ActivityResponse> approveActivity(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(activityService.approveActivity(id, userDetails.getId()));
    }

    // Approver rejects activity
    @PostMapping("/{id}/reject")
    public ResponseEntity<ActivityResponse> rejectActivity(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(activityService.rejectActivity(id, userDetails.getId()));
    }
}
