package com.example.backend.repository;

import com.example.backend.entity.Event;
import com.example.backend.entity.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for Event entity.
 * Provides CRUD operations and custom query methods for events.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    
    /**
     * Find all events by college ID.
     * @param collegeId the college ID
     * @return List of events for the specified college
     */
    List<Event> findByCollegeId(UUID collegeId);
    
    /**
     * Find all events by category ID.
     * @param categoryId the category ID
     * @return List of events in the specified category
     */
    List<Event> findByCategoryId(UUID categoryId);
    
    /**
     * Find all events organized by a specific profile.
     * @param organizerId the organizer's profile ID
     * @return List of events organized by the specified user
     */
    List<Event> findByOrganizerId(UUID organizerId);
    
    /**
     * Find all events with a specific status.
     * @param eventStatus the event status
     * @return List of events with the specified status
     */
    List<Event> findByEventStatus(EventStatus eventStatus);
    
    /**
     * Find all published events that are upcoming (start date in the future).
     * @param currentTime the current timestamp
     * @return List of upcoming published events
     */
    @Query("SELECT e FROM Event e WHERE e.eventStatus = 'PUBLISHED' AND e.startDate > :currentTime ORDER BY e.startDate ASC")
    List<Event> findUpcomingPublishedEvents(@Param("currentTime") OffsetDateTime currentTime);
    
    /**
     * Find all events by college and status.
     * @param collegeId the college ID
     * @param eventStatus the event status
     * @return List of events matching the criteria
     */
    List<Event> findByCollegeIdAndEventStatus(UUID collegeId, EventStatus eventStatus);
}
