package com.example.backend.controller;

import com.example.backend.entity.College;
import com.example.backend.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for College entity.
 * Provides CRUD endpoints for managing colleges.
 */
@RestController
@RequestMapping("/api/colleges")
@CrossOrigin(origins = "http://localhost:3000")
@SuppressWarnings("null")
public class CollegeController {

    @Autowired
    private CollegeRepository collegeRepository;

    /**
     * Get all colleges.
     * @return List of all colleges
     */
    @GetMapping
    public ResponseEntity<List<College>> getAllColleges() {
        List<College> colleges = collegeRepository.findAll();
        return ResponseEntity.ok(colleges);
    }

    /**
     * Get a single college by ID.
     * @param id the college UUID
     * @return College entity or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<College> getCollegeById(@PathVariable UUID id) {
        return collegeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new college.
     * @param college the college to create
     * @return Created college with 201 status
     */
    @PostMapping
    public ResponseEntity<College> createCollege(@RequestBody College college) {
        College savedCollege = collegeRepository.save(college);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCollege);
    }

    /**
     * Update an existing college.
     * @param id the college UUID
     * @param collegeDetails updated college data
     * @return Updated college or 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<College> updateCollege(
            @PathVariable UUID id,
            @RequestBody College collegeDetails) {
        
        return collegeRepository.findById(id)
                .map(college -> {
                    college.setName(collegeDetails.getName());
                    college.setLocation(collegeDetails.getLocation());
                    college.setDescription(collegeDetails.getDescription());
                    college.setLogoUrl(collegeDetails.getLogoUrl());
                    college.setWebsite(collegeDetails.getWebsite());
                    college.setEstablishedYear(collegeDetails.getEstablishedYear());
                    college.setContactEmail(collegeDetails.getContactEmail());
                    college.setContactPhone(collegeDetails.getContactPhone());
                    college.setUpdatedAt(OffsetDateTime.now());
                    College updatedCollege = collegeRepository.save(college);
                    return ResponseEntity.ok(updatedCollege);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a college by ID.
     * @param id the college UUID
     * @return 204 No Content if deleted, 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollege(@PathVariable UUID id) {
        if (collegeRepository.existsById(id)) {
            collegeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
