package com.example.backend.repository;

import com.example.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Review entity.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    
    /**
     * Find all reviews for a specific event.
     */
    List<Review> findByEventId(UUID eventId);
    
    /**
     * Find all reviews by a specific user.
     */
    List<Review> findByUser_Id(UUID userId);
    
    /**
     * Find reviews by rating.
     */
    List<Review> findByRating(Integer rating);
}
