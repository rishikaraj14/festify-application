/**
 * Teams Service
 * Handles all team-related API calls
 */

import { api } from '@/utils/apiClient';
import type { 
  Team, 
  CreateTeamDTO, 
  UpdateTeamDTO 
} from '@/types/api';

/**
 * Get all teams (admin only)
 */
export async function getAll(): Promise<Team[]> {
  return await api.get<Team[]>('/api/teams');
}

/**
 * Get team by ID
 */
export async function getById(id: string): Promise<Team> {
  return await api.get<Team>(`/api/teams/${id}`);
}

/**
 * Get teams by event ID
 */
export async function getByEventId(eventId: string): Promise<Team[]> {
  return await api.get<Team[]>(`/api/teams/event/${eventId}`);
}

/**
 * Get teams by leader ID
 */
export async function getByLeaderId(leaderId: string): Promise<Team[]> {
  return await api.get<Team[]>(`/api/teams/leader/${leaderId}`);
}

/**
 * Create a new team
 */
export async function create(team: CreateTeamDTO): Promise<Team> {
  return await api.post<Team>('/api/teams', team);
}

/**
 * Update an existing team
 */
export async function update(id: string, team: UpdateTeamDTO): Promise<Team> {
  return await api.put<Team>(`/api/teams/${id}`, team);
}

/**
 * Delete a team
 */
export async function deleteTeam(id: string): Promise<void> {
  await api.delete<void>(`/api/teams/${id}`);
}

/**
 * Search teams by name, leader name, or email
 */
export function searchTeams(
  teams: Team[],
  searchTerm: string
): Team[] {
  const term = searchTerm.toLowerCase();
  return teams.filter(team => 
    team.teamName.toLowerCase().includes(term) ||
    team.teamLeaderName.toLowerCase().includes(term) ||
    team.teamLeaderEmail?.toLowerCase().includes(term)
  );
}

/**
 * Sort teams by name (A-Z)
 */
export function sortByName(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => 
    a.teamName.localeCompare(b.teamName)
  );
}

/**
 * Sort teams by creation date (newest first)
 */
export function sortByDateDesc(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Sort teams by creation date (oldest first)
 */
export function sortByDateAsc(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/**
 * Group teams by event
 */
export function groupByEvent(teams: Team[]): Record<string, Team[]> {
  return teams.reduce((acc, team) => {
    const eventId = team.eventId;
    if (!acc[eventId]) {
      acc[eventId] = [];
    }
    acc[eventId].push(team);
    return acc;
  }, {} as Record<string, Team[]>);
}

/**
 * Filter teams by leader
 */
export function filterByLeader(teams: Team[], leaderId: string): Team[] {
  return teams.filter(team => team.teamLeaderId === leaderId);
}

/**
 * Get teams with specific name pattern
 */
export function getTeamsByPattern(teams: Team[], pattern: RegExp): Team[] {
  return teams.filter(team => pattern.test(team.teamName));
}

/**
 * Count teams by event
 */
export function countByEvent(teams: Team[]): Record<string, number> {
  return teams.reduce((acc, team) => {
    const eventId = team.eventId;
    acc[eventId] = (acc[eventId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// Export as a single service object
export const teamsService = {
  getAll,
  getById,
  getByEventId,
  getByLeaderId,
  create,
  update,
  delete: deleteTeam,
  searchTeams,
  sortByName,
  sortByDateDesc,
  sortByDateAsc,
  groupByEvent,
  filterByLeader,
  getTeamsByPattern,
  countByEvent,
};
