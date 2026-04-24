package com.workerconnect.repository;

import com.workerconnect.model.HelperProfile;
import com.workerconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HelperProfileRepository extends JpaRepository<HelperProfile, Long> {
    Optional<HelperProfile> findByUser(User user);
    Optional<HelperProfile> findByUserId(Long userId);
}
