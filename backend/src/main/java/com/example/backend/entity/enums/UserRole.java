package com.example.backend.entity.enums;

/**
 * User role enumeration matching Supabase user_role type.
 * Defines the three user roles in the Festify system.
 */
public enum UserRole {
    /**
     * Administrator with full system access
     */
    ADMIN,
    
    /**
     * Regular attendee user who can register for events
     */
    ATTENDEE,
    
    /**
     * Event organizer who can create and manage events
     */
    ORGANIZER
}
