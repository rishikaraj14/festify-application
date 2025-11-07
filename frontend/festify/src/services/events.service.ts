/**
 * Events Service
 * Handles all API calls related to events
 */

import { api, apiPublicFetch } from '@/utils/apiClient';
import type { Event, CreateEventDTO, UpdateEventDTO, EventStatus } from '@/types/api';

export const eventsService = {
  /**
   * Get all events (public endpoint)
   */
  async getAll(): Promise<Event[]> {
    return apiPublicFetch<Event[]>('/api/events');
  },

  /**
   * Get a single event by ID (public endpoint)
   */
  async getById(id: string): Promise<Event> {
    return apiPublicFetch<Event>(`/api/events/${id}`);
  },

  /**
   * Get events by college ID
   */
  async getByCollege(collegeId: string): Promise<Event[]> {
    return apiPublicFetch<Event[]>(`/api/events/college/${collegeId}`);
  },

  /**
   * Get events by category ID
   */
  async getByCategory(categoryId: string): Promise<Event[]> {
    return apiPublicFetch<Event[]>(`/api/events/category/${categoryId}`);
  },

  /**
   * Get events by organizer ID (requires authentication)
   */
  async getByOrganizer(organizerId: string): Promise<Event[]> {
    return api.get<Event[]>(`/api/events/organizer/${organizerId}`);
  },

  /**
   * Get events by status
   */
  async getByStatus(status: EventStatus): Promise<Event[]> {
    return apiPublicFetch<Event[]>(`/api/events/status/${status}`);
  },

  /**
   * Get upcoming published events
   */
  async getUpcoming(): Promise<Event[]> {
    return apiPublicFetch<Event[]>('/api/events/upcoming');
  },

  /**
   * Create a new event (requires authentication)
   */
  async create(event: CreateEventDTO): Promise<Event> {
    return api.post<Event>('/api/events', event);
  },

  /**
   * Update an existing event (requires authentication)
   */
  async update(id: string, event: UpdateEventDTO): Promise<Event> {
    return api.put<Event>(`/api/events/${id}`, event);
  },

  /**
   * Delete an event (requires authentication)
   */
  async delete(id: string): Promise<void> {
    return api.delete<void>(`/api/events/${id}`);
  },

  /**
   * Filter events based on user eligibility
   */
  filterByEligibility(events: Event[], profile: { college_id?: string } | null): Event[] {
    if (!events || events.length === 0) return [];
    
    if (profile) {
      return events.filter((event) => {
        // Global events are visible to everyone
        if (event.global) return true;
        
        // Events without a college are visible to everyone
        if (!event.college?.id) return true;
        
        // If user has no college, they only see global events
        if (!profile.college_id) return event.global || !event.college?.id;
        
        // College-specific events are only visible to users from that college
        return event.college.id === profile.college_id;
      });
    }
    
    // Not logged in users only see global events and events without college
    return events.filter((event) => event.global || !event.college?.id);
  },

  /**
   * Search and filter events
   */
  searchAndFilter(
    events: Event[],
    options: {
      searchTerm?: string;
      categoryId?: string;
      collegeId?: string;
      status?: EventStatus;
    }
  ): Event[] {
    if (!events || events.length === 0) return [];

    return events.filter((event) => {
      // Category filter
      if (options.categoryId && event.category.id !== options.categoryId) {
        return false;
      }

      // College filter
      if (options.collegeId && event.college.id !== options.collegeId) {
        return false;
      }

      // Status filter
      if (options.status && event.eventStatus !== options.status) {
        return false;
      }

      // Search term filter
      if (options.searchTerm) {
        const searchLower = options.searchTerm.toLowerCase();
        return (
          event.title?.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.college?.name?.toLowerCase().includes(searchLower) ||
          event.location?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  },
};
