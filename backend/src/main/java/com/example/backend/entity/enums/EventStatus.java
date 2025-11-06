package com.example.backend.entity.enums;

/**
 * Event status enumeration matching Supabase event_status type.
 * Tracks the lifecycle state of events.
 */
public enum EventStatus {
    /**
     * Event is being drafted and not yet published
     */
    DRAFT,
    
    /**
     * Event is published and visible to users
     */
    PUBLISHED,
    
    /**
     * Event has concluded successfully
     */
    COMPLETED,
    
    /**
     * Event has been cancelled
     */
    CANCELLED
}
