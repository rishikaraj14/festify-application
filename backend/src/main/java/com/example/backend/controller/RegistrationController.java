package com.example.backend.controller;

import com.example.backend.entity.Registration;
import com.example.backend.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for Registration entity.
 * Handles CRUD operations for event registrations.
 */
@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:3000")
@SuppressWarnings("null")
public class RegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;

    /**
     * Get all registrations.
     */
    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        List<Registration> registrations = registrationRepository.findAll();
        return ResponseEntity.ok(registrations);
    }

    /**
     * Get registration by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Registration> getRegistrationById(@PathVariable UUID id) {
        return registrationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new registration.
     */
    @PostMapping
    public ResponseEntity<Registration> createRegistration(@RequestBody Registration registration) {
        registration.setCreatedAt(OffsetDateTime.now());
        registration.setUpdatedAt(OffsetDateTime.now());
        Registration savedRegistration = registrationRepository.save(registration);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRegistration);
    }

    /**
     * Update an existing registration.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Registration> updateRegistration(
            @PathVariable UUID id,
            @RequestBody Registration registrationDetails) {
        
        return registrationRepository.findById(id)
                .map(registration -> {
                    registration.setEvent(registrationDetails.getEvent());
                    registration.setUser(registrationDetails.getUser());
                    registration.setStatus(registrationDetails.getStatus());
                    registration.setUpdatedAt(OffsetDateTime.now());
                    
                    Registration updatedRegistration = registrationRepository.save(registration);
                    return ResponseEntity.ok(updatedRegistration);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a registration.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistration(@PathVariable UUID id) {
        if (registrationRepository.existsById(id)) {
            registrationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get registrations by event ID.
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Registration>> getRegistrationsByEvent(@PathVariable UUID eventId) {
        List<Registration> registrations = registrationRepository.findByEventId(eventId);
        return ResponseEntity.ok(registrations);
    }

    /**
     * Get registrations by user ID.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Registration>> getRegistrationsByUser(@PathVariable UUID userId) {
        List<Registration> registrations = registrationRepository.findByUserId(userId);
        return ResponseEntity.ok(registrations);
    }
}
