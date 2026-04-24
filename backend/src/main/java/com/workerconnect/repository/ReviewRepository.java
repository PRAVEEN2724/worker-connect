package com.workerconnect.repository;

import com.workerconnect.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee.id = :revieweeId")
    Double findAverageRatingByRevieweeId(@Param("revieweeId") Long revieweeId);

    boolean existsByReviewerIdAndRevieweeId(Long reviewerId, Long revieweeId);
}
