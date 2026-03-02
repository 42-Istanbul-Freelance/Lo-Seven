package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.dto.SchoolStatsDto;
import com.pearlconnect.backend.service.HqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hq")
@RequiredArgsConstructor
public class HqController {

    private final HqService hqService;

    @GetMapping("/schools-stats")
    @PreAuthorize("hasRole('HQ')")
    public ResponseEntity<List<SchoolStatsDto>> getSchoolsStats() {
        return ResponseEntity.ok(hqService.getAllSchoolsStats());
    }
}
