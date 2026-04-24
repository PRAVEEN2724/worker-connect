package com.workerconnect.service;

import com.workerconnect.model.*;
import com.workerconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobApplication applyToJob(Long helperId, Long jobId, String coverMessage) {
        if (applicationRepository.existsByJobIdAndHelperId(jobId, helperId)) {
            throw new RuntimeException("You have already applied to this job");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (job.getStatus() != Job.Status.OPEN) {
            throw new RuntimeException("This job is no longer accepting applications");
        }

        User helper = userRepository.findById(helperId)
                .orElseThrow(() -> new RuntimeException("Helper not found"));

        JobApplication application = JobApplication.builder()
                .job(job)
                .helper(helper)
                .coverMessage(coverMessage)
                .status(JobApplication.Status.PENDING)
                .build();

        return applicationRepository.save(application);
    }

    public List<JobApplication> getJobApplications(Long jobId, Long workerId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getWorker().getId().equals(workerId)) {
            throw new RuntimeException("Unauthorized");
        }
        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
    }

    public List<JobApplication> getHelperApplications(Long helperId) {
        return applicationRepository.findByHelperIdOrderByAppliedAtDesc(helperId);
    }

    public JobApplication updateApplicationStatus(Long applicationId, JobApplication.Status status, Long workerId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getWorker().getId().equals(workerId)) {
            throw new RuntimeException("Unauthorized: Only the job poster can update application status");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }
}
