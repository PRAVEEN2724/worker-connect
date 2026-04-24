package com.workerconnect.controller;

import com.workerconnect.model.HelperProfile;
import com.workerconnect.repository.UserRepository;
import com.workerconnect.service.HelperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/helpers")
@RequiredArgsConstructor
public class HelperController {

    private final HelperService helperService;
    private final UserRepository userRepository;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<HelperProfile> getHelperProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(helperService.getProfileByUserId(userId));
    }

    @PostMapping("/profile")
    public ResponseEntity<HelperProfile> createOrUpdateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody HelperProfile profileData) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(helperService.createOrUpdateProfile(userId, profileData));
    }

    @PatchMapping("/availability")
    public ResponseEntity<String> updateAvailability(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String availability) {
        Long userId = getUserId(userDetails);
        helperService.updateAvailability(userId, HelperProfile.Availability.valueOf(availability.toUpperCase()));
        return ResponseEntity.ok("Availability updated");
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
