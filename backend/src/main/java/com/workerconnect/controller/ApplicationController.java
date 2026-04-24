package com.workerconnect.controller;

import com.workerconnect.model.JobApplication;
import com.workerconnect.repository.UserRepository;
import com.workerconnect.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    @PostMapping("/job/{jobId}")
    public ResponseEntity<JobApplication> applyToJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobId,
            @RequestBody Map<String, String> body) {
        Long helperId = getUserId(userDetails);
        return ResponseEntity.ok(applicationService.applyToJob(helperId, jobId, body.get("coverMessage")));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getJobApplications(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobId) {
        Long workerId = getUserId(userDetails);
        return ResponseEntity.ok(applicationService.getJobApplications(jobId, workerId));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<JobApplication>> getMyApplications(@AuthenticationPrincipal UserDetails userDetails) {
        Long helperId = getUserId(userDetails);
        return ResponseEntity.ok(applicationService.getHelperApplications(helperId));
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> body) {
        Long workerId = getUserId(userDetails);
        JobApplication.Status status = JobApplication.Status.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, status, workerId));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
