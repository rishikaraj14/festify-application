package com.example.backend.controller;

import com.example.backend.entity.Event;
import com.example.backend.entity.enums.EventStatus;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.CollegeRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for Event entity.
 * Provides CRUD endpoints for managing events.
 */
@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
@SuppressWarnings("null")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private ProfileRepository profileRepository;

    /**
     * Get all events.
     * @return List of all events
     */
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    /**
     * Get a single event by ID.
     * @param id the event UUID
     * @return Event entity or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable UUID id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all events by college ID.
     * @param collegeId the college UUID
     * @return List of events for the specified college
     */
    @GetMapping("/college/{collegeId}")
    public ResponseEntity<List<Event>> getEventsByCollege(@PathVariable UUID collegeId) {
        List<Event> events = eventRepository.findByCollegeId(collegeId);
        return ResponseEntity.ok(events);
    }

    /**
     * Get all events by category ID.
     * @param categoryId the category UUID
     * @return List of events in the specified category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Event>> getEventsByCategory(@PathVariable UUID categoryId) {
        List<Event> events = eventRepository.findByCategoryId(categoryId);
        return ResponseEntity.ok(events);
    }

    /**
     * Get all events by organizer ID.
     * @param organizerId the organizer's profile UUID
     * @return List of events organized by the specified user
     */
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable UUID organizerId) {
        List<Event> events = eventRepository.findByOrganizerId(organizerId);
        return ResponseEntity.ok(events);
    }

    /**
     * Get all events by status.
     * @param status the event status (DRAFT, PUBLISHED, COMPLETED, CANCELLED)
     * @return List of events with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Event>> getEventsByStatus(@PathVariable EventStatus status) {
        List<Event> events = eventRepository.findByStatus(status);
        return ResponseEntity.ok(events);
    }

    /**
     * Get all upcoming published events.
     * @return List of future published events
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        List<Event> events = eventRepository.findUpcomingPublishedEvents(OffsetDateTime.now());
        return ResponseEntity.ok(events);
    }

    /**
     * Create a new event.
     * @param event the event to create
     * @return Created event with 201 status, or 400 if relationships are invalid
     */
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        // Validate and set category relationship
        if (event.getCategory() == null || event.getCategory().getId() == null) {
            return ResponseEntity.badRequest().body("Category is required");
        }
        var category = categoryRepository.findById(event.getCategory().getId())
                .orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body("Category not found");
        }
        event.setCategory(category);

        // Validate and set college relationship
        if (event.getCollege() == null || event.getCollege().getId() == null) {
            return ResponseEntity.badRequest().body("College is required");
        }
        var college = collegeRepository.findById(event.getCollege().getId())
                .orElse(null);
        if (college == null) {
            return ResponseEntity.badRequest().body("College not found");
        }
        event.setCollege(college);

        // Validate and set organizer relationship
        if (event.getOrganizer() == null || event.getOrganizer().getId() == null) {
            return ResponseEntity.badRequest().body("Organizer is required");
        }
        var organizer = profileRepository.findById(event.getOrganizer().getId())
                .orElse(null);
        if (organizer == null) {
            return ResponseEntity.badRequest().body("Organizer not found");
        }
        event.setOrganizer(organizer);

        Event savedEvent = eventRepository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
    }

    /**
     * Update an existing event.
     * @param id the event UUID
     * @param eventDetails updated event data
     * @return Updated event or 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable UUID id,
            @RequestBody Event eventDetails) {
        
        return eventRepository.findById(id)
                .map(event -> {
                    event.setTitle(eventDetails.getTitle());
                    event.setDescription(eventDetails.getDescription());
                    event.setBannerUrl(eventDetails.getBannerUrl());
                    event.setStartTime(eventDetails.getStartTime());
                    event.setEndTime(eventDetails.getEndTime());
                    event.setVenue(eventDetails.getVenue());
                    event.setCapacity(eventDetails.getCapacity());
                    event.setPrice(eventDetails.getPrice());
                    event.setParticipationType(eventDetails.getParticipationType());
                    event.setStatus(eventDetails.getStatus());

                    // Update category if provided
                    if (eventDetails.getCategory() != null && eventDetails.getCategory().getId() != null) {
                        categoryRepository.findById(eventDetails.getCategory().getId())
                                .ifPresent(event::setCategory);
                    }

                    // Update college if provided
                    if (eventDetails.getCollege() != null && eventDetails.getCollege().getId() != null) {
                        collegeRepository.findById(eventDetails.getCollege().getId())
                                .ifPresent(event::setCollege);
                    }

                    // Update organizer if provided
                    if (eventDetails.getOrganizer() != null && eventDetails.getOrganizer().getId() != null) {
                        profileRepository.findById(eventDetails.getOrganizer().getId())
                                .ifPresent(event::setOrganizer);
                    }

                    event.setUpdatedAt(OffsetDateTime.now());
                    Event updatedEvent = eventRepository.save(event);
                    return ResponseEntity.ok(updatedEvent);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete an event by ID.
     * @param id the event UUID
     * @return 204 No Content if deleted, 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
