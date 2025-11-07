/**
 * Registrations Service
 * Handles all registration-related API calls
 */

import { api } from '@/utils/apiClient';
import type { 
  Registration, 
  CreateRegistrationDTO, 
  UpdateRegistrationDTO,
  RegistrationStatus,
  PaymentStatus
} from '@/types/api';

/**
 * Get all registrations (admin only)
 */
export async function getAll(): Promise<Registration[]> {
  return await api.get<Registration[]>('/api/registrations');
}

/**
 * Get registration by ID
 */
export async function getById(id: string): Promise<Registration> {
  return await api.get<Registration>(`/api/registrations/${id}`);
}

/**
 * Get registrations by event ID
 */
export async function getByEventId(eventId: string): Promise<Registration[]> {
  return await api.get<Registration[]>(`/api/registrations/event/${eventId}`);
}

/**
 * Get registrations by user ID
 */
export async function getByUserId(userId: string): Promise<Registration[]> {
  return await api.get<Registration[]>(`/api/registrations/user/${userId}`);
}

/**
 * Create a new registration
 */
export async function create(registration: CreateRegistrationDTO): Promise<Registration> {
  return await api.post<Registration>('/api/registrations', registration);
}

/**
 * Update an existing registration
 */
export async function update(id: string, registration: UpdateRegistrationDTO): Promise<Registration> {
  return await api.put<Registration>(`/api/registrations/${id}`, registration);
}

/**
 * Delete a registration
 */
export async function deleteRegistration(id: string): Promise<void> {
  await api.delete<void>(`/api/registrations/${id}`);
}

/**
 * Filter registrations by status
 */
export function filterByStatus(
  registrations: Registration[],
  status: RegistrationStatus
): Registration[] {
  return registrations.filter(reg => reg.registrationStatus === status);
}

/**
 * Filter registrations by payment status
 */
export function filterByPaymentStatus(
  registrations: Registration[],
  status: PaymentStatus
): Registration[] {
  return registrations.filter(reg => reg.paymentStatus === status);
}

/**
 * Get team registrations only
 */
export function getTeamRegistrations(registrations: Registration[]): Registration[] {
  return registrations.filter(reg => reg.team === true);
}

/**
 * Get individual registrations only
 */
export function getIndividualRegistrations(registrations: Registration[]): Registration[] {
  return registrations.filter(reg => reg.team === false);
}

/**
 * Get pending registrations
 */
export function getPendingRegistrations(registrations: Registration[]): Registration[] {
  return filterByStatus(registrations, 'PENDING' as RegistrationStatus);
}

/**
 * Get confirmed registrations
 */
export function getConfirmedRegistrations(registrations: Registration[]): Registration[] {
  return filterByStatus(registrations, 'CONFIRMED' as RegistrationStatus);
}

/**
 * Get attended registrations
 */
export function getAttendedRegistrations(registrations: Registration[]): Registration[] {
  return filterByStatus(registrations, 'ATTENDED' as RegistrationStatus);
}

/**
 * Get unpaid registrations
 */
export function getUnpaidRegistrations(registrations: Registration[]): Registration[] {
  return filterByPaymentStatus(registrations, 'PENDING' as PaymentStatus);
}

/**
 * Get paid registrations
 */
export function getPaidRegistrations(registrations: Registration[]): Registration[] {
  return filterByPaymentStatus(registrations, 'COMPLETED' as PaymentStatus);
}

/**
 * Search registrations by team name, leader name, or email
 */
export function searchRegistrations(
  registrations: Registration[],
  searchTerm: string
): Registration[] {
  const term = searchTerm.toLowerCase();
  return registrations.filter(reg => 
    reg.teamName?.toLowerCase().includes(term) ||
    reg.teamLeaderName?.toLowerCase().includes(term) ||
    reg.teamLeaderEmail?.toLowerCase().includes(term) ||
    reg.user?.fullName?.toLowerCase().includes(term) ||
    reg.user?.email?.toLowerCase().includes(term)
  );
}

/**
 * Sort registrations by date (newest first)
 */
export function sortByDateDesc(registrations: Registration[]): Registration[] {
  return [...registrations].sort((a, b) => 
    new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
  );
}

/**
 * Sort registrations by date (oldest first)
 */
export function sortByDateAsc(registrations: Registration[]): Registration[] {
  return [...registrations].sort((a, b) => 
    new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
  );
}

/**
 * Calculate total revenue from registrations
 */
export function calculateTotalRevenue(registrations: Registration[]): number {
  return registrations.reduce((total, reg) => total + (reg.paymentAmount || 0), 0);
}

/**
 * Group registrations by event
 */
export function groupByEvent(registrations: Registration[]): Record<string, Registration[]> {
  return registrations.reduce((acc, reg) => {
    const eventId = reg.eventId;
    if (!acc[eventId]) {
      acc[eventId] = [];
    }
    acc[eventId].push(reg);
    return acc;
  }, {} as Record<string, Registration[]>);
}

// Export as a single service object
export const registrationsService = {
  getAll,
  getById,
  getByEventId,
  getByUserId,
  create,
  update,
  delete: deleteRegistration,
  filterByStatus,
  filterByPaymentStatus,
  getTeamRegistrations,
  getIndividualRegistrations,
  getPendingRegistrations,
  getConfirmedRegistrations,
  getAttendedRegistrations,
  getUnpaidRegistrations,
  getPaidRegistrations,
  searchRegistrations,
  sortByDateDesc,
  sortByDateAsc,
  calculateTotalRevenue,
  groupByEvent,
};
