/**
 * API Client Usage Examples
 * 
 * This file demonstrates how to use the apiClient utility
 * to make authenticated requests to your Spring Boot backend.
 */

import { apiFetch, api, apiPublicFetch } from '@/utils/apiClient'

// ===========================
// Example 1: Using apiFetch directly
// ===========================

// GET request
async function getEvents() {
  try {
    const events = await apiFetch('/api/events')
    console.log('Events:', events)
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}

// POST request
async function createEvent(eventData: any) {
  try {
    const newEvent = await apiFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    })
    console.log('Created event:', newEvent)
    return newEvent
  } catch (error) {
    console.error('Failed to create event:', error)
    throw error
  }
}

// PUT request
async function updateEvent(id: string, updates: any) {
  try {
    const updated = await apiFetch(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
    return updated
  } catch (error) {
    console.error('Failed to update event:', error)
    throw error
  }
}

// DELETE request
async function deleteEvent(id: string) {
  try {
    await apiFetch(`/api/events/${id}`, {
      method: 'DELETE'
    })
    console.log('Event deleted successfully')
  } catch (error) {
    console.error('Failed to delete event:', error)
    throw error
  }
}

// ===========================
// Example 2: Using helper methods
// ===========================

// GET - much cleaner!
async function getEventsSimple() {
  const events = await api.get('/api/events')
  return events
}

// POST
async function createEventSimple(eventData: any) {
  const newEvent = await api.post('/api/events', eventData)
  return newEvent
}

// PUT
async function updateEventSimple(id: string, updates: any) {
  const updated = await api.put(`/api/events/${id}`, updates)
  return updated
}

// DELETE
async function deleteEventSimple(id: string) {
  await api.delete(`/api/events/${id}`)
}

// ===========================
// Example 3: TypeScript with types
// ===========================

interface Event {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
}

async function getTypedEvents() {
  // Specify return type for better TypeScript support
  const events = await api.get<Event[]>('/api/events')
  return events
}

async function getEventById(id: string) {
  const event = await api.get<Event>(`/api/events/${id}`)
  return event
}

// ===========================
// Example 4: React Component Usage
// ===========================

'use client'

import { useEffect, useState } from 'react'

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      setLoading(true)
      const data = await api.get<Event[]>('/api/events')
      setEvents(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/api/events/${id}`)
      // Reload events after deletion
      await loadEvents()
    } catch (err) {
      alert('Failed to delete event')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <button onClick={() => handleDelete(event.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

// ===========================
// Example 5: Public Endpoints (No Auth)
// ===========================

// For endpoints that don't require authentication
async function getPublicEvents() {
  const events = await apiPublicFetch('/api/events/upcoming')
  return events
}

// ===========================
// Example 6: Complex Queries
// ===========================

// Get registrations for a specific event
async function getEventRegistrations(eventId: string) {
  const registrations = await api.get(`/api/registrations/event/${eventId}`)
  return registrations
}

// Get user's registrations
async function getMyRegistrations(userId: string) {
  const registrations = await api.get(`/api/registrations/user/${userId}`)
  return registrations
}

// Create a new registration
async function registerForEvent(eventId: string, userId: string) {
  const registration = await api.post('/api/registrations', {
    event: { id: eventId },
    user: { id: userId },
    status: 'PENDING'
  })
  return registration
}

// ===========================
// Example 7: Error Handling
// ===========================

async function handleApiErrors() {
  try {
    const data = await api.get('/api/events')
    return data
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific errors
      if (error.message === 'Unauthorized') {
        console.log('User will be redirected to login automatically')
        return
      }
      
      if (error.message.includes('404')) {
        console.log('Resource not found')
        return
      }
      
      // Generic error
      console.error('API Error:', error.message)
    }
  }
}

// ===========================
// Example 8: Form Submission
// ===========================

async function handleEventFormSubmit(formData: FormData) {
  const eventData = {
    title: formData.get('title'),
    description: formData.get('description'),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    venue: formData.get('venue'),
    capacity: parseInt(formData.get('capacity') as string),
    price: parseFloat(formData.get('price') as string),
    category: { id: formData.get('categoryId') },
    college: { id: formData.get('collegeId') },
    organizer: { id: formData.get('organizerId') },
    participationType: formData.get('participationType'),
    status: 'DRAFT'
  }

  try {
    const newEvent = await api.post('/api/events', eventData)
    console.log('Event created:', newEvent)
    return newEvent
  } catch (error) {
    console.error('Failed to create event:', error)
    throw error
  }
}

// ===========================
// Example 9: Authentication Check
// ===========================

async function checkAuthentication() {
  try {
    // This endpoint requires authentication
    const userInfo = await api.get('/api/auth/me')
    console.log('Authenticated user:', userInfo)
    return userInfo
  } catch (error) {
    // If this fails with 401, user will be redirected to login
    console.log('Not authenticated')
    return null
  }
}

// ===========================
// Example 10: All CRUD Operations
// ===========================

class EventService {
  // Create
  static async create(eventData: Partial<Event>) {
    return api.post<Event>('/api/events', eventData)
  }

  // Read (all)
  static async getAll() {
    return api.get<Event[]>('/api/events')
  }

  // Read (one)
  static async getById(id: string) {
    return api.get<Event>(`/api/events/${id}`)
  }

  // Update
  static async update(id: string, updates: Partial<Event>) {
    return api.put<Event>(`/api/events/${id}`, updates)
  }

  // Delete
  static async delete(id: string) {
    return api.delete(`/api/events/${id}`)
  }

  // Custom queries
  static async getUpcoming() {
    return api.get<Event[]>('/api/events/upcoming')
  }

  static async getByCollege(collegeId: string) {
    return api.get<Event[]>(`/api/events/college/${collegeId}`)
  }

  static async getByCategory(categoryId: string) {
    return api.get<Event[]>(`/api/events/category/${categoryId}`)
  }
}

// Usage
async function useEventService() {
  // Get all events
  const events = await EventService.getAll()
  
  // Get specific event
  const event = await EventService.getById('some-uuid')
  
  // Create event
  const newEvent = await EventService.create({
    title: 'New Event',
    description: 'Event description'
  })
  
  // Update event
  const updated = await EventService.update('some-uuid', {
    title: 'Updated Title'
  })
  
  // Delete event
  await EventService.delete('some-uuid')
  
  // Get upcoming events
  const upcoming = await EventService.getUpcoming()
}
