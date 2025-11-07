/**
 * Colleges Service
 * Handles all API calls related to colleges
 */

import { api, apiPublicFetch } from '@/utils/apiClient';
import type { College, CreateCollegeDTO, UpdateCollegeDTO } from '@/types/api';

export const collegesService = {
  /**
   * Get all colleges (public endpoint)
   */
  async getAll(): Promise<College[]> {
    return apiPublicFetch<College[]>('/api/colleges');
  },

  /**
   * Get a single college by ID (public endpoint)
   */
  async getById(id: string): Promise<College> {
    return apiPublicFetch<College>(`/api/colleges/${id}`);
  },

  /**
   * Create a new college (requires authentication - admin only)
   */
  async create(college: CreateCollegeDTO): Promise<College> {
    return api.post<College>('/api/colleges', college);
  },

  /**
   * Update an existing college (requires authentication - admin only)
   */
  async update(id: string, college: UpdateCollegeDTO): Promise<College> {
    return api.put<College>(`/api/colleges/${id}`, college);
  },

  /**
   * Delete a college (requires authentication - admin only)
   */
  async delete(id: string): Promise<void> {
    return api.delete<void>(`/api/colleges/${id}`);
  },

  /**
   * Search colleges by name or location
   */
  searchColleges(colleges: College[], searchTerm: string): College[] {
    if (!colleges || colleges.length === 0) return [];
    if (!searchTerm.trim()) return colleges;

    const searchLower = searchTerm.toLowerCase();
    return colleges.filter((college) =>
      college.name?.toLowerCase().includes(searchLower) ||
      college.location?.toLowerCase().includes(searchLower) ||
      college.description?.toLowerCase().includes(searchLower)
    );
  },

  /**
   * Sort colleges by name
   */
  sortCollegesByName(colleges: College[]): College[] {
    return [...colleges].sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Group colleges by location
   */
  groupByLocation(colleges: College[]): Record<string, College[]> {
    return colleges.reduce((acc, college) => {
      const location = college.location || 'Unknown';
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(college);
      return acc;
    }, {} as Record<string, College[]>);
  },
};
