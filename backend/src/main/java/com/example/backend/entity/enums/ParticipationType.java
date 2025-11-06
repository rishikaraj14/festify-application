package com.example.backend.entity.enums;

/**
 * Participation type enumeration matching Supabase participation_type.
 * Defines how users can participate in events.
 */
public enum ParticipationType {
    /**
     * Only individual registration allowed
     */
    INDIVIDUAL,
    
    /**
     * Only team registration allowed
     */
    TEAM,
    
    /**
     * Both individual and team registration allowed
     */
    BOTH
}
