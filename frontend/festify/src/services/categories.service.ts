/**
 * Categories Service
 * Handles all API calls related to categories
 */

import { api, apiPublicFetch } from '@/utils/apiClient';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/types/api';

export const categoriesService = {
  /**
   * Get all categories (public endpoint)
   */
  async getAll(): Promise<Category[]> {
    return apiPublicFetch<Category[]>('/api/categories');
  },

  /**
   * Get a single category by ID (public endpoint)
   */
  async getById(id: string): Promise<Category> {
    return apiPublicFetch<Category>(`/api/categories/${id}`);
  },

  /**
   * Create a new category (requires authentication - admin only)
   */
  async create(category: CreateCategoryDTO): Promise<Category> {
    return api.post<Category>('/api/categories', category);
  },

  /**
   * Update an existing category (requires authentication - admin only)
   */
  async update(id: string, category: UpdateCategoryDTO): Promise<Category> {
    return api.put<Category>(`/api/categories/${id}`, category);
  },

  /**
   * Delete a category (requires authentication - admin only)
   */
  async delete(id: string): Promise<void> {
    return api.delete<void>(`/api/categories/${id}`);
  },
};
