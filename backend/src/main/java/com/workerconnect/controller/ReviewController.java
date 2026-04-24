package com.workerconnect.controller;

import com.workerconnect.model.Review;
import com.workerconnect.repository.UserRepository;
import com.workerconnect.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping("/user/{revieweeId}")
    public ResponseEntity<Review> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long revieweeId,
            @RequestBody Map<String, Object> body) {
        Long reviewerId = getUserId(userDetails);
        Integer rating = (Integer) body.get("rating");
        String comment = (String) body.get("comment");
        Review.ReviewType reviewType = Review.ReviewType.valueOf((String) body.get("reviewType"));
        return ResponseEntity.ok(reviewService.createReview(reviewerId, revieweeId, rating, comment, reviewType));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
