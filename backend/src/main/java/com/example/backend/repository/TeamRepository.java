package com.example.backend.repository;

import com.example.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Team entity.
 */
@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {
    
    /**
     * Find all teams for a specific event.
     */
    List<Team> findByEventId(UUID eventId);
    
    /**
     * Find teams by leader ID.
     */
    List<Team> findByTeamLeaderId(UUID leaderId);
    
    /**
     * Find team by registration ID.
     */
    Optional<Team> findByRegistrationId(UUID registrationId);
}
