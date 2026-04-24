package com.workerconnect.controller;

import com.workerconnect.model.Job;
import com.workerconnect.repository.UserRepository;
import com.workerconnect.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Job> createJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Job jobData) {
        Long workerId = getUserId(userDetails);
        return ResponseEntity.ok(jobService.createJob(workerId, jobData));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<Job>> getMyJobs(@AuthenticationPrincipal UserDetails userDetails) {
        Long workerId = getUserId(userDetails);
        return ResponseEntity.ok(jobService.getWorkerJobs(workerId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minWage) {
        return ResponseEntity.ok(jobService.searchJobs(city, category, minWage));
    }

    @GetMapping("/open")
    public ResponseEntity<List<Job>> getOpenJobs() {
        return ResponseEntity.ok(jobService.getOpenJobs());
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<Job> getJobById(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getJobById(jobId));
    }

    @PatchMapping("/{jobId}/status")
    public ResponseEntity<Job> updateJobStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobId,
            @RequestBody Map<String, String> body) {
        Long workerId = getUserId(userDetails);
        Job.Status status = Job.Status.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(jobService.updateJobStatus(jobId, status, workerId));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<String> deleteJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long jobId) {
        Long workerId = getUserId(userDetails);
        jobService.deleteJob(jobId, workerId);
        return ResponseEntity.ok("Job deleted");
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
