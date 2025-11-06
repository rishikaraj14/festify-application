package com.example.backend.repository;

import com.example.backend.entity.Payment;
import com.example.backend.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Payment entity.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    
    /**
     * Find payments by registration ID.
     */
    List<Payment> findByRegistrationId(UUID registrationId);
    
    /**
     * Find payment by transaction ID.
     */
    Optional<Payment> findByTransactionId(String transactionId);
    
    /**
     * Find payments by status.
     */
    List<Payment> findByStatus(PaymentStatus status);
    
    /**
     * Find payments by ticket ID.
     */
    List<Payment> findByTicketId(UUID ticketId);
}
