package com.example.backend.controller;

import com.example.backend.entity.Review;
import com.example.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for Review entity.
 * Handles CRUD operations for event reviews.
 */
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
@SuppressWarnings("null")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    /**
     * Get all reviews.
     */
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get review by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable UUID id) {
        return reviewRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new review.
     */
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        review.setCreatedAt(OffsetDateTime.now());
        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    /**
     * Update an existing review.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable UUID id,
            @RequestBody Review reviewDetails) {
        
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setEvent(reviewDetails.getEvent());
                    review.setUser(reviewDetails.getUser());
                    review.setRating(reviewDetails.getRating());
                    review.setComment(reviewDetails.getComment());
                    
                    Review updatedReview = reviewRepository.save(review);
                    return ResponseEntity.ok(updatedReview);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a review.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get reviews by event ID.
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Review>> getReviewsByEvent(@PathVariable UUID eventId) {
        List<Review> reviews = reviewRepository.findByEventId(eventId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get reviews by user ID.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable UUID userId) {
        List<Review> reviews = reviewRepository.findByUserId(userId);
        return ResponseEntity.ok(reviews);
    }
}
