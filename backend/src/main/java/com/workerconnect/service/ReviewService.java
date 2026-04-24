package com.workerconnect.service;

import com.workerconnect.model.*;
import com.workerconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final HelperProfileRepository helperProfileRepository;
    private final UserRepository userRepository;

    public Review createReview(Long reviewerId, Long revieweeId, Integer rating, String comment, Review.ReviewType reviewType) {
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));
        User reviewee = userRepository.findById(revieweeId)
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));

        Review review = Review.builder()
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(rating)
                .comment(comment)
                .reviewType(reviewType)
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update average rating
        updateAverageRating(revieweeId, reviewType);

        return savedReview;
    }

    private void updateAverageRating(Long revieweeId, Review.ReviewType reviewType) {
        Double avg = reviewRepository.findAverageRatingByRevieweeId(revieweeId);
        final double avgRating = (avg == null) ? 0.0 : avg;
        final int totalRatings = reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(revieweeId).size();

        if (reviewType == Review.ReviewType.CUSTOMER_TO_WORKER) {
            workerProfileRepository.findByUserId(revieweeId).ifPresent(wp -> {
                wp.setAverageRating(Math.round(avgRating * 10.0) / 10.0);
                wp.setTotalRatings(totalRatings);
                workerProfileRepository.save(wp);
            });
        } else {
            helperProfileRepository.findByUserId(revieweeId).ifPresent(hp -> {
                hp.setAverageRating(Math.round(avgRating * 10.0) / 10.0);
                hp.setTotalRatings(totalRatings);
                helperProfileRepository.save(hp);
            });
        }
    }

    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId);
    }
}
