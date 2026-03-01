package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.dto.HqStatsDto;
import com.pearlconnect.backend.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportingController {

    private final ReportingService reportingService;

    @GetMapping("/stats")
    public ResponseEntity<HqStatsDto> getStats() {
        return ResponseEntity.ok(reportingService.getHqStats());
    }
}
