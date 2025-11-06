import { supabase } from '@/lib/supabase/client'

/**
 * API Client utility for making authenticated requests to the Spring Boot backend.
 * Automatically includes Supabase JWT token in Authorization header.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * Makes an authenticated API request to the backend.
 * 
 * @param path - API endpoint path (e.g., '/api/events')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws Error if request fails
 * 
 * @example
 * ```ts
 * // GET request
 * const events = await apiFetch('/api/events')
 * 
 * // POST request
 * const newEvent = await apiFetch('/api/events', {
 *   method: 'POST',
 *   body: JSON.stringify({ title: 'New Event' })
 * })
 * ```
 */
export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {

  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('Error getting session:', sessionError)
    // Redirect to login if session error
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    throw new Error('Authentication required')
  }

  if (!session) {
    // No session - redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    throw new Error('Not authenticated')
  }

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
    ...options?.headers,
  }

  // Build full URL
  const url = `${API_BASE_URL}${path}`

  try {
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      console.error('Unauthorized - redirecting to login')
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      throw new Error('Unauthorized')
    }

    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || errorData.error || `Request failed with status ${response.status}`
      )
    }

    // Handle 204 No Content (e.g., DELETE responses)
    if (response.status === 204) {
      return undefined as T
    }

    // Parse and return JSON response
    const data = await response.json()
    return data as T
  } catch (error) {
    // Re-throw the error for the caller to handle
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}

/**
 * Makes an API request without authentication (for public endpoints).
 * 
 * @param path - API endpoint path
 * @param options - Fetch options
 * @returns Parsed JSON response
 */
export async function apiPublicFetch<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || errorData.error || `Request failed with status ${response.status}`
      )
    }

    if (response.status === 204) {
      return undefined as T
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}

/**
 * Helper functions for common HTTP methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(path: string) => 
    apiFetch<T>(path, { method: 'GET' }),

  /**
   * POST request
   */
  post: <T = any>(path: string, body?: any) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T = any>(path: string, body?: any) =>
    apiFetch<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T = any>(path: string) =>
    apiFetch<T>(path, { method: 'DELETE' }),

  /**
   * PATCH request
   */
  patch: <T = any>(path: string, body?: any) =>
    apiFetch<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
}
