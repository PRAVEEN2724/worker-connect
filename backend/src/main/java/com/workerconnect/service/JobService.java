package com.workerconnect.service;

import com.workerconnect.model.*;
import com.workerconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public Job createJob(Long workerId, Job jobData) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        Job job = Job.builder()
                .worker(worker)
                .title(jobData.getTitle())
                .jobDescription(jobData.getJobDescription())
                .location(jobData.getLocation())
                .city(jobData.getCity())
                .pincode(jobData.getPincode())
                .wagePerDay(jobData.getWagePerDay())
                .numHelpersNeeded(jobData.getNumHelpersNeeded())
                .jobDate(jobData.getJobDate())
                .category(jobData.getCategory())
                .status(Job.Status.OPEN)
                .build();

        return jobRepository.save(job);
    }

    public List<Job> getWorkerJobs(Long workerId) {
        return jobRepository.findByWorkerIdOrderByCreatedAtDesc(workerId);
    }

    public List<Job> searchJobs(String city, String category, Double minWage) {
        return jobRepository.searchJobs(
                (city != null && !city.isEmpty()) ? city : null,
                (category != null && !category.isEmpty()) ? category : null,
                minWage
        );
    }

    public List<Job> getOpenJobs() {
        return jobRepository.findByStatusOrderByCreatedAtDesc(Job.Status.OPEN);
    }

    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public Job updateJobStatus(Long jobId, Job.Status status, Long workerId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getWorker().getId().equals(workerId)) {
            throw new RuntimeException("Unauthorized: You can only update your own jobs");
        }

        job.setStatus(status);
        return jobRepository.save(job);
    }

    public void deleteJob(Long jobId, Long workerId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getWorker().getId().equals(workerId)) {
            throw new RuntimeException("Unauthorized");
        }
        jobRepository.delete(job);
    }
}
