package com.example.backend.repository;

import com.example.backend.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for Profile entity.
 * Provides CRUD operations and custom query methods for user profiles.
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    
    /**
     * Find a profile by email address.
     * @param email the user's email
     * @return Optional containing the profile if found
     */
    Optional<Profile> findByEmail(String email);
}
