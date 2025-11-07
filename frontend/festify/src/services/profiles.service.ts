/**
 * Profiles Service
 * Handles all API calls related to user profiles
 */

import { api } from '@/utils/apiClient';
import type { Profile, CreateProfileDTO, UpdateProfileDTO, UserRole } from '@/types/api';

export const profilesService = {
  /**
   * Get all profiles (requires authentication - admin only)
   */
  async getAll(): Promise<Profile[]> {
    return api.get<Profile[]>('/api/profiles');
  },

  /**
   * Get a single profile by profile ID (requires authentication)
   */
  async getById(id: string): Promise<Profile> {
    return api.get<Profile>(`/api/profiles/${id}`);
  },

  /**
   * Get profile by Supabase user ID (requires authentication)
   */
  async getByUserId(userId: string): Promise<Profile> {
    return api.get<Profile>(`/api/profiles/user/${userId}`);
  },

  /**
   * Get profile by email (requires authentication)
   */
  async getByEmail(email: string): Promise<Profile> {
    return api.get<Profile>(`/api/profiles/email/${email}`);
  },

  /**
   * Create a new profile (requires authentication)
   */
  async create(profile: CreateProfileDTO): Promise<Profile> {
    return api.post<Profile>('/api/profiles', profile);
  },

  /**
   * Update an existing profile (requires authentication)
   */
  async update(id: string, profile: UpdateProfileDTO): Promise<Profile> {
    return api.put<Profile>(`/api/profiles/${id}`, profile);
  },

  /**
   * Delete a profile (requires authentication - admin only)
   */
  async delete(id: string): Promise<void> {
    return api.delete<void>(`/api/profiles/${id}`);
  },

  /**
   * Filter profiles by role
   */
  filterByRole(profiles: Profile[], role: UserRole): Profile[] {
    if (!profiles || profiles.length === 0) return [];
    return profiles.filter((profile) => profile.role === role);
  },

  /**
   * Filter profiles by college
   */
  filterByCollege(profiles: Profile[], collegeId: string): Profile[] {
    if (!profiles || profiles.length === 0) return [];
    return profiles.filter((profile) => profile.college?.id === collegeId);
  },

  /**
   * Get organizers only
   */
  getOrganizers(profiles: Profile[]): Profile[] {
    return this.filterByRole(profiles, 'ORGANIZER' as UserRole);
  },

  /**
   * Get attendees only
   */
  getAttendees(profiles: Profile[]): Profile[] {
    return this.filterByRole(profiles, 'ATTENDEE' as UserRole);
  },

  /**
   * Search profiles by name or email
   */
  searchProfiles(profiles: Profile[], searchTerm: string): Profile[] {
    if (!profiles || profiles.length === 0) return [];
    if (!searchTerm.trim()) return profiles;

    const searchLower = searchTerm.toLowerCase();
    return profiles.filter((profile) =>
      profile.fullName?.toLowerCase().includes(searchLower) ||
      profile.email?.toLowerCase().includes(searchLower) ||
      profile.organizationName?.toLowerCase().includes(searchLower)
    );
  },
};
