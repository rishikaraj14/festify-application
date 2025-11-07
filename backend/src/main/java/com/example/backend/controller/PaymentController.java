package com.example.backend.controller;

import com.example.backend.entity.Payment;
import com.example.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for Payment entity.
 * Handles CRUD operations for payments.
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
@SuppressWarnings("null")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Get all payments.
     */
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return ResponseEntity.ok(payments);
    }

    /**
     * Get payment by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable UUID id) {
        return paymentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new payment.
     */
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        OffsetDateTime now = OffsetDateTime.now();
        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(now);
        }
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);
        Payment savedPayment = paymentRepository.save(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPayment);
    }

    /**
     * Update an existing payment.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable UUID id,
            @RequestBody Payment paymentDetails) {
        
        return paymentRepository.findById(id)
                .map(payment -> {
                    payment.setRegistration(paymentDetails.getRegistration());
                    payment.setTicket(paymentDetails.getTicket());
                    payment.setPaymentStatus(paymentDetails.getPaymentStatus());
                    payment.setAmount(paymentDetails.getAmount());
                    payment.setPaymentMethod(paymentDetails.getPaymentMethod());
                    payment.setTransactionId(paymentDetails.getTransactionId());
                    payment.setPaymentDate(paymentDetails.getPaymentDate());
                    payment.setUpdatedAt(OffsetDateTime.now());
                    
                    Payment updatedPayment = paymentRepository.save(payment);
                    return ResponseEntity.ok(updatedPayment);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a payment.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable UUID id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get payments by registration ID.
     */
    @GetMapping("/registration/{registrationId}")
    public ResponseEntity<List<Payment>> getPaymentsByRegistration(@PathVariable UUID registrationId) {
        List<Payment> payments = paymentRepository.findByRegistrationId(registrationId);
        return ResponseEntity.ok(payments);
    }

    /**
     * Get payment by transaction ID.
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getPaymentByTransactionId(@PathVariable String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
