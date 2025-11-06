package com.example.backend.repository;

import com.example.backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Ticket entity.
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    
    /**
     * Find ticket by registration ID.
     */
    Optional<Ticket> findByRegistrationId(UUID registrationId);
    
    /**
     * Find all tickets for a specific event.
     */
    List<Ticket> findByEventId(UUID eventId);
}
