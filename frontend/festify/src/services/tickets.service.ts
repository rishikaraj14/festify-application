/**
 * Tickets Service
 * Handles all ticket-related API calls
 */

import { api } from '@/utils/apiClient';
import type { 
  Ticket, 
  CreateTicketDTO, 
  UpdateTicketDTO,
  TicketType
} from '@/types/api';

/**
 * Get all tickets (admin only)
 */
export async function getAll(): Promise<Ticket[]> {
  return await api.get<Ticket[]>('/api/tickets');
}

/**
 * Get ticket by ID
 */
export async function getById(id: string): Promise<Ticket> {
  return await api.get<Ticket>(`/api/tickets/${id}`);
}

/**
 * Get tickets by event ID
 */
export async function getByEventId(eventId: string): Promise<Ticket[]> {
  return await api.get<Ticket[]>(`/api/tickets/event/${eventId}`);
}

/**
 * Get ticket by registration ID
 */
export async function getByRegistrationId(registrationId: string): Promise<Ticket> {
  return await api.get<Ticket>(`/api/tickets/registration/${registrationId}`);
}

/**
 * Create a new ticket
 */
export async function create(ticket: CreateTicketDTO): Promise<Ticket> {
  return await api.post<Ticket>('/api/tickets', ticket);
}

/**
 * Update an existing ticket
 */
export async function update(id: string, ticket: UpdateTicketDTO): Promise<Ticket> {
  return await api.put<Ticket>(`/api/tickets/${id}`, ticket);
}

/**
 * Delete a ticket
 */
export async function deleteTicket(id: string): Promise<void> {
  await api.delete<void>(`/api/tickets/${id}`);
}

/**
 * Filter tickets by type
 */
export function filterByType(
  tickets: Ticket[],
  type: TicketType
): Ticket[] {
  return tickets.filter(ticket => ticket.ticketType === type);
}

/**
 * Get valid tickets only
 */
export function getValidTickets(tickets: Ticket[]): Ticket[] {
  return tickets.filter(ticket => ticket.valid === true);
}

/**
 * Get invalid/used tickets
 */
export function getInvalidTickets(tickets: Ticket[]): Ticket[] {
  return tickets.filter(ticket => ticket.valid === false);
}

/**
 * Get used tickets
 */
export function getUsedTickets(tickets: Ticket[]): Ticket[] {
  return tickets.filter(ticket => ticket.usedAt !== null);
}

/**
 * Get unused tickets
 */
export function getUnusedTickets(tickets: Ticket[]): Ticket[] {
  return tickets.filter(ticket => ticket.usedAt === null && ticket.valid === true);
}

/**
 * Get free tickets
 */
export function getFreeTickets(tickets: Ticket[]): Ticket[] {
  return filterByType(tickets, 'FREE' as TicketType);
}

/**
 * Get paid tickets
 */
export function getPaidTickets(tickets: Ticket[]): Ticket[] {
  return filterByType(tickets, 'PAID' as TicketType);
}

/**
 * Get VIP tickets
 */
export function getVIPTickets(tickets: Ticket[]): Ticket[] {
  return filterByType(tickets, 'VIP' as TicketType);
}

/**
 * Get early bird tickets
 */
export function getEarlyBirdTickets(tickets: Ticket[]): Ticket[] {
  return filterByType(tickets, 'EARLY_BIRD' as TicketType);
}

/**
 * Search tickets by ticket code
 */
export function searchByTicketCode(
  tickets: Ticket[],
  searchTerm: string
): Ticket[] {
  const term = searchTerm.toLowerCase();
  return tickets.filter(ticket => 
    ticket.ticketCode.toLowerCase().includes(term)
  );
}

/**
 * Sort tickets by issue date (newest first)
 */
export function sortByIssueDateDesc(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => 
    new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  );
}

/**
 * Sort tickets by issue date (oldest first)
 */
export function sortByIssueDateAsc(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => 
    new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime()
  );
}

/**
 * Sort tickets by price (highest first)
 */
export function sortByPriceDesc(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => b.price - a.price);
}

/**
 * Sort tickets by price (lowest first)
 */
export function sortByPriceAsc(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => a.price - b.price);
}

/**
 * Group tickets by type
 */
export function groupByType(tickets: Ticket[]): Record<TicketType, Ticket[]> {
  return tickets.reduce((acc, ticket) => {
    const type = ticket.ticketType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(ticket);
    return acc;
  }, {} as Record<TicketType, Ticket[]>);
}

/**
 * Group tickets by event
 */
export function groupByEvent(tickets: Ticket[]): Record<string, Ticket[]> {
  return tickets.reduce((acc, ticket) => {
    const eventId = ticket.eventId;
    if (!acc[eventId]) {
      acc[eventId] = [];
    }
    acc[eventId].push(ticket);
    return acc;
  }, {} as Record<string, Ticket[]>);
}

/**
 * Calculate total ticket revenue
 */
export function calculateTotalRevenue(tickets: Ticket[]): number {
  return tickets.reduce((total, ticket) => total + ticket.price, 0);
}

/**
 * Calculate revenue by ticket type
 */
export function calculateRevenueByType(tickets: Ticket[]): Record<TicketType, number> {
  return tickets.reduce((acc, ticket) => {
    const type = ticket.ticketType;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += ticket.price;
    return acc;
  }, {} as Record<TicketType, number>);
}

/**
 * Get tickets issued within date range
 */
export function getTicketsInDateRange(
  tickets: Ticket[],
  startDate: Date,
  endDate: Date
): Ticket[] {
  return tickets.filter(ticket => {
    const issuedDate = new Date(ticket.issuedAt);
    return issuedDate >= startDate && issuedDate <= endDate;
  });
}

/**
 * Get ticket statistics
 */
export function getTicketStatistics(tickets: Ticket[]) {
  const valid = getValidTickets(tickets);
  const invalid = getInvalidTickets(tickets);
  const used = getUsedTickets(tickets);
  const unused = getUnusedTickets(tickets);
  const grouped = groupByType(tickets);

  return {
    total: tickets.length,
    valid: valid.length,
    invalid: invalid.length,
    used: used.length,
    unused: unused.length,
    byType: {
      free: grouped.FREE?.length || 0,
      paid: grouped.PAID?.length || 0,
      vip: grouped.VIP?.length || 0,
      earlyBird: grouped.EARLY_BIRD?.length || 0,
    },
    totalRevenue: calculateTotalRevenue(tickets),
    revenueByType: calculateRevenueByType(tickets),
    averagePrice: tickets.length > 0 
      ? calculateTotalRevenue(tickets) / tickets.length 
      : 0,
  };
}

/**
 * Validate ticket code format
 */
export function validateTicketCode(ticketCode: string): boolean {
  // Basic validation - adjust as needed
  return ticketCode.length >= 8 && /^[A-Za-z0-9-]+$/.test(ticketCode);
}

/**
 * Generate ticket code (client-side utility)
 */
export function generateTicketCode(prefix: string = 'TIX'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

// Export as a single service object
export const ticketsService = {
  getAll,
  getById,
  getByEventId,
  getByRegistrationId,
  create,
  update,
  delete: deleteTicket,
  filterByType,
  getValidTickets,
  getInvalidTickets,
  getUsedTickets,
  getUnusedTickets,
  getFreeTickets,
  getPaidTickets,
  getVIPTickets,
  getEarlyBirdTickets,
  searchByTicketCode,
  sortByIssueDateDesc,
  sortByIssueDateAsc,
  sortByPriceDesc,
  sortByPriceAsc,
  groupByType,
  groupByEvent,
  calculateTotalRevenue,
  calculateRevenueByType,
  getTicketsInDateRange,
  getTicketStatistics,
  validateTicketCode,
  generateTicketCode,
};
