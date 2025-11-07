package com.example.backend.repository;

import com.example.backend.entity.Registration;
import com.example.backend.entity.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Registration entity.
 */
@Repository
public interface RegistrationRepository extends JpaRepository<Registration, UUID> {
    
    /**
     * Find all registrations for a specific event.
     */
    List<Registration> findByEventId(UUID eventId);
    
    /**
     * Find all registrations for a specific user.
     */
    List<Registration> findByUser_Id(UUID userId);
    
    /**
     * Find registrations by status.
     */
    List<Registration> findByRegistrationStatus(RegistrationStatus status);
    
    /**
     * Find registrations for an event by status.
     */
    List<Registration> findByEventIdAndRegistrationStatus(UUID eventId, RegistrationStatus status);
}
