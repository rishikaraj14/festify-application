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

  // Check if this is a GET request to a public endpoint
  const method = options?.method?.toUpperCase() || 'GET'
  const isPublicEndpoint = method === 'GET' && (
    path.startsWith('/api/events') ||
    path.startsWith('/api/categories') ||
    path.startsWith('/api/colleges') ||
    path.startsWith('/api/hello') ||
    path.startsWith('/api/health')
  )

  // If no session and it's a public GET endpoint, use public fetch
  if (!session && isPublicEndpoint) {
    return apiPublicFetch<T>(path, options)
  }

  if (sessionError) {
    console.error('Error getting session:', sessionError)
    // For public endpoints, fallback to public fetch
    if (isPublicEndpoint) {
      return apiPublicFetch<T>(path, options)
    }
    // Redirect to login for protected endpoints
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error('Authentication required')
  }

  if (!session) {
    // For public endpoints, use public fetch
    if (isPublicEndpoint) {
      return apiPublicFetch<T>(path, options)
    }
    // No session - redirect to login for protected endpoints
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error('Not authenticated')
  }

  // Build headers with auth token
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
      console.error('Unauthorized - token may be expired')
      // For public endpoints, retry without auth
      if (isPublicEndpoint) {
        return apiPublicFetch<T>(path, options)
      }
      // Redirect to login for protected endpoints
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
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
      // Add credentials: 'omit' to prevent sending cookies
      credentials: 'omit',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`
      console.error(`API Error [${response.status}]:`, errorMessage)
      throw new Error(errorMessage)
    }

    if (response.status === 204) {
      return undefined as T
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error('Public API fetch error:', error)
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
