package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.dto.ParticipationCompleteRequest;
import com.pearlconnect.backend.dto.ParticipationRequest;
import com.pearlconnect.backend.dto.ParticipationResponse;
import com.pearlconnect.backend.security.CustomUserDetails;
import com.pearlconnect.backend.service.ParticipationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ParticipationResponse> participate(
            @Valid @RequestBody ParticipationRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        ParticipationResponse response = participationService.participateInActivity(currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ParticipationResponse> completeParticipation(
            @PathVariable Long id,
            @RequestBody ParticipationCompleteRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        ParticipationResponse response = participationService.completeParticipation(id, currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ParticipationResponse>> getMyParticipations(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<ParticipationResponse> responses = participationService.getMyParticipations(currentUser.getId());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<ParticipationResponse>> getActivityParticipations(
            @PathVariable Long activityId) {
        List<ParticipationResponse> responses = participationService.getActivityParticipations(activityId);
        return ResponseEntity.ok(responses);
    }
}
