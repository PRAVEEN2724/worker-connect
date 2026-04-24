package com.workerconnect.controller;

import com.workerconnect.model.WorkerProfile;
import com.workerconnect.repository.UserRepository;
import com.workerconnect.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;
    private final UserRepository userRepository;

    @GetMapping("/search")
    public ResponseEntity<List<WorkerProfile>> searchWorkers(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String pincode,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(workerService.searchWorkers(city, pincode, category));
    }

    @GetMapping
    public ResponseEntity<List<WorkerProfile>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<WorkerProfile> getWorkerProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(workerService.getProfileByUserId(userId));
    }

    @PostMapping("/profile")
    public ResponseEntity<WorkerProfile> createOrUpdateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody WorkerProfile profileData) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(workerService.createOrUpdateProfile(userId, profileData));
    }

    @PatchMapping("/availability")
    public ResponseEntity<String> updateAvailability(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String availability) {
        Long userId = getUserId(userDetails);
        workerService.updateAvailability(userId, WorkerProfile.Availability.valueOf(availability.toUpperCase()));
        return ResponseEntity.ok("Availability updated");
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
