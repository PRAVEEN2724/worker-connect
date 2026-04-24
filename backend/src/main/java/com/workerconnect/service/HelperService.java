package com.workerconnect.service;

import com.workerconnect.model.*;
import com.workerconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HelperService {

    private final HelperProfileRepository helperProfileRepository;
    private final UserRepository userRepository;

    public HelperProfile createOrUpdateProfile(Long userId, HelperProfile profileData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        HelperProfile profile = helperProfileRepository.findByUserId(userId)
                .orElse(HelperProfile.builder().user(user).build());

        if (profileData.getWorkTypes() != null) profile.setWorkTypes(profileData.getWorkTypes());
        if (profileData.getExperience() != null) profile.setExperience(profileData.getExperience());
        if (profileData.getAvailability() != null) profile.setAvailability(profileData.getAvailability());
        if (profileData.getProfileImageUrl() != null) profile.setProfileImageUrl(profileData.getProfileImageUrl());
        if (profileData.getBio() != null) profile.setBio(profileData.getBio());

        return helperProfileRepository.save(profile);
    }

    public HelperProfile getProfileByUserId(Long userId) {
        return helperProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Helper profile not found"));
    }

    public void updateAvailability(Long userId, HelperProfile.Availability availability) {
        HelperProfile profile = helperProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Helper profile not found"));
        profile.setAvailability(availability);
        helperProfileRepository.save(profile);
    }
}
