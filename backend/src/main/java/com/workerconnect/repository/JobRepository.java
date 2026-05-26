package com.workerconnect.repository;

import com.workerconnect.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByWorkerIdOrderByCreatedAtDesc(Long workerId);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND " +
           "(COALESCE(:city, '') = '' OR LOWER(j.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(COALESCE(:category, '') = '' OR LOWER(j.category) LIKE LOWER(CONCAT('%', :category, '%'))) AND " +
           "(:minWage IS NULL OR j.wagePerDay >= :minWage)")
    List<Job> searchJobs(@Param("city") String city,
                         @Param("category") String category,
                         @Param("minWage") Double minWage);

    List<Job> findByStatusOrderByCreatedAtDesc(Job.Status status);
}
