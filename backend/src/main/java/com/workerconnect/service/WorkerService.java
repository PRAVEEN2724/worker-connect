package com.workerconnect.service;

import com.workerconnect.model.*;
import com.workerconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerProfileRepository workerProfileRepository;
    private final UserRepository userRepository;

    public WorkerProfile createOrUpdateProfile(Long userId, WorkerProfile profileData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkerProfile profile = workerProfileRepository.findByUserId(userId)
                .orElse(WorkerProfile.builder().user(user).build());

        if (profileData.getSkills() != null) profile.setSkills(profileData.getSkills());
        if (profileData.getCategory() != null) profile.setCategory(profileData.getCategory());
        if (profileData.getExperience() != null) profile.setExperience(profileData.getExperience());
        if (profileData.getPricePerService() != null) profile.setPricePerService(profileData.getPricePerService());
        if (profileData.getAvailability() != null) profile.setAvailability(profileData.getAvailability());
        if (profileData.getProfileImageUrl() != null) profile.setProfileImageUrl(profileData.getProfileImageUrl());
        if (profileData.getWorkSampleUrl() != null) profile.setWorkSampleUrl(profileData.getWorkSampleUrl());
        if (profileData.getBio() != null) profile.setBio(profileData.getBio());

        return workerProfileRepository.save(profile);
    }

    public WorkerProfile getProfileByUserId(Long userId) {
        return workerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
    }

    public WorkerProfile getProfileById(Long profileId) {
        return workerProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
    }

    public List<WorkerProfile> searchWorkers(String city, String pincode, String category) {
        return workerProfileRepository.searchWorkers(
                (city != null && !city.isEmpty()) ? city : null,
                (pincode != null && !pincode.isEmpty()) ? pincode : null,
                (category != null && !category.isEmpty()) ? category : null
        );
    }

    public List<WorkerProfile> getAllWorkers() {
        return workerProfileRepository.findAll();
    }

    public void updateAvailability(Long userId, WorkerProfile.Availability availability) {
        WorkerProfile profile = workerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
        profile.setAvailability(availability);
        workerProfileRepository.save(profile);
    }
}
