package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.dto.GamificationProfileDto;
import com.pearlconnect.backend.security.CustomUserDetails;
import com.pearlconnect.backend.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gamification")
@RequiredArgsConstructor
public class GamificationController {

    private final GamificationService gamificationService;

    @GetMapping("/profile")
    public ResponseEntity<GamificationProfileDto> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(gamificationService.getGamificationProfile(userDetails.getId()));
    }
}
