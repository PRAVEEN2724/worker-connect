package com.workerconnect.repository;

import com.workerconnect.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobIdOrderByAppliedAtDesc(Long jobId);
    List<JobApplication> findByHelperIdOrderByAppliedAtDesc(Long helperId);
    boolean existsByJobIdAndHelperId(Long jobId, Long helperId);
    Optional<JobApplication> findByJobIdAndHelperId(Long jobId, Long helperId);
}
