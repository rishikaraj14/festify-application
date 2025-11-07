package com.example.backend.controller;

import com.example.backend.entity.Profile;
import com.example.backend.repository.CollegeRepository;
import com.example.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for Profile entity.
 * Provides CRUD endpoints for managing user profiles.
 */
@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
@SuppressWarnings("null")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    /**
     * Get all profiles.
     * @return List of all profiles
     */
    @GetMapping
    public ResponseEntity<List<Profile>> getAllProfiles() {
        List<Profile> profiles = profileRepository.findAll();
        return ResponseEntity.ok(profiles);
    }

    /**
     * Get a single profile by ID.
     * @param id the profile UUID
     * @return Profile entity or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable UUID id) {
        return profileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get profile by user ID (Supabase auth ID).
     * @param userId the Supabase user UUID
     * @return Profile entity or 404 if not found
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Profile> getProfileByUserId(@PathVariable UUID userId) {
        return profileRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get profile by email.
     * @param email the user's email
     * @return Profile entity or 404 if not found
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Profile> getProfileByEmail(@PathVariable String email) {
        return profileRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new profile.
     * @param profile the profile to create
     * @return Created profile with 201 status
     */
    @PostMapping
    public ResponseEntity<Profile> createProfile(@RequestBody Profile profile) {
        Profile savedProfile = profileRepository.save(profile);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);
    }

    /**
     * Update an existing profile.
     * @param id the profile UUID
     * @param profileDetails updated profile data
     * @return Updated profile or 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(
            @PathVariable UUID id,
            @RequestBody Profile profileDetails) {
        
        return profileRepository.findById(id)
                .map(profile -> {
                    profile.setFullName(profileDetails.getFullName());
                    profile.setEmail(profileDetails.getEmail());
                    profile.setAvatarUrl(profileDetails.getAvatarUrl());
                    profile.setPhone(profileDetails.getPhone());
                    profile.setBio(profileDetails.getBio());
                    profile.setOrganizationName(profileDetails.getOrganizationName());
                    profile.setWebsite(profileDetails.getWebsite());
                    profile.setRole(profileDetails.getRole());
                    
                    // Update college relationship if provided
                    if (profileDetails.getCollege() != null && profileDetails.getCollege().getId() != null) {
                        collegeRepository.findById(profileDetails.getCollege().getId())
                                .ifPresent(profile::setCollege);
                    }
                    
                    profile.setUpdatedAt(OffsetDateTime.now());
                    Profile updatedProfile = profileRepository.save(profile);
                    return ResponseEntity.ok(updatedProfile);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a profile by ID.
     * @param id the profile UUID
     * @return 204 No Content if deleted, 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable UUID id) {
        if (profileRepository.existsById(id)) {
            profileRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
