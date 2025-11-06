import { supabase } from '@/lib/supabase/client';
import { apiFetch } from '@/utils/apiClient';

export interface TeamMember {
  id?: string;
  name: string;
  email: string;
  phone: string;
  university_reg: string;
  is_leader?: boolean;
}

export interface TeamData {
  team_name: string;
  team_leader_name: string;
  team_leader_phone: string;
  team_leader_email: string;
  team_leader_university_reg: string;
  members: TeamMember[];
}

export interface Team {
  id: string;
  registration_id: string;
  team_name: string;
  team_leader_id: string;
  team_leader_name: string;
  team_leader_phone: string;
  team_leader_email: string;
  team_leader_university_reg: string;
  event_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create a team with members
 * Replaced RPC call with sequential API calls
 */
export async function createTeamWithMembers(
  registrationId: string,
  eventId: string,
  teamData: TeamData
): Promise<string | null> {
  try {
    // Create the team first
    const team = await apiFetch('/api/teams', {
      method: 'POST',
      body: JSON.stringify({
        registration: { id: registrationId },
        event: { id: eventId },
        name: teamData.team_name,
        leaderName: teamData.team_leader_name,
        leaderPhone: teamData.team_leader_phone,
        leaderEmail: teamData.team_leader_email,
        leaderUniversityReg: teamData.team_leader_university_reg
      })
    });

    if (!team || !team.id) {
      console.error('Failed to create team');
      return null;
    }

    // Add team members if any
    if (teamData.members && teamData.members.length > 0) {
      for (const member of teamData.members) {
        try {
          await apiFetch('/api/team-members', {
            method: 'POST',
            body: JSON.stringify({
              team: { id: team.id },
              member: { id: null }, // Member might not have a user ID yet
              memberName: member.name,
              memberEmail: member.email,
              memberPhone: member.phone,
              universityRegistrationNumber: member.university_reg,
              isLeader: false
            })
          });
        } catch (memberError) {
          console.error('Error adding team member:', memberError);
          // Continue with other members even if one fails
        }
      }
    }

    return team.id;
  } catch (error) {
    console.error('Error creating team with members:', error);
    return null;
  }
}

/**
 * Get team details including all members
 * Replaced RPC call with sequential API calls
 */
export async function getTeamDetails(teamId: string): Promise<any | null> {
  try {
    // Fetch team details
    const team = await apiFetch(`/api/teams/${teamId}`);

    if (!team) {
      console.error('Team not found');
      return null;
    }

    // Fetch team members
    const members = await apiFetch(`/api/team-members/team/${teamId}`);

    // Combine team and members data
    return {
      ...team,
      members: members || []
    };
  } catch (error) {
    console.error('Error fetching team details:', error);
    return null;
  }
}

/**
 * Get teams for an event
 */
export async function getEventTeams(eventId: string): Promise<Team[]> {
  try {
    const data = await apiFetch(`/api/teams/event/${eventId}`);
    return (data as Team[]) || [];
  } catch (error) {
    console.error('Error getting event teams:', error);
    return [];
  }
}

/**
 * Get team members for a team
 */
export async function getTeamMembers(teamId: string): Promise<any[]> {
  try {
    const data = await apiFetch(`/api/team-members/team/${teamId}`);
    return data || [];
  } catch (error) {
    console.error('Error getting team members:', error);
    return [];
  }
}

/**
 * Update team information
 */
export async function updateTeam(
  teamId: string,
  updates: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  try {
    await apiFetch(`/api/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString()
      })
    });
    return true;
  } catch (error) {
    console.error('Error updating team:', error);
    return false;
  }
}

/**
 * Add member to team
 */
export async function addTeamMember(
  teamId: string,
  registrationId: string,
  member: TeamMember
): Promise<boolean> {
  try {
    await apiFetch('/api/team-members', {
      method: 'POST',
      body: JSON.stringify({
        team: { id: teamId },
        member: { id: null }, // Member might not have a user ID yet
        memberName: member.name,
        memberEmail: member.email,
        memberPhone: member.phone,
        universityRegistrationNumber: member.university_reg,
        isLeader: false
      })
    });
    return true;
  } catch (error) {
    console.error('Error adding team member:', error);
    return false;
  }
}

/**
 * Remove member from team
 */
export async function removeTeamMember(memberId: string): Promise<boolean> {
  try {
    await apiFetch(`/api/team-members/${memberId}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error('Error removing team member:', error);
    return false;
  }
}

/**
 * Validate team data
 */
export function validateTeamData(teamData: TeamData, teamSize: number): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate team name
  if (!teamData.team_name || teamData.team_name.trim().length < 3) {
    errors.push('Team name must be at least 3 characters');
  }

  // Validate leader info
  if (!teamData.team_leader_name || teamData.team_leader_name.trim().length < 2) {
    errors.push('Team leader name is required');
  }

  if (!teamData.team_leader_email || !isValidEmail(teamData.team_leader_email)) {
    errors.push('Valid team leader email is required');
  }

  if (!teamData.team_leader_phone || !isValidPhone(teamData.team_leader_phone)) {
    errors.push('Valid team leader phone number is required');
  }

  if (!teamData.team_leader_university_reg || teamData.team_leader_university_reg.trim().length < 3) {
    errors.push('Team leader university registration number is required');
  }

  // Validate members
  if (teamData.members.length + 1 !== teamSize) {
    errors.push(`Total team size should be ${teamSize} (including leader)`);
  }

  teamData.members.forEach((member, index) => {
    if (!member.name || member.name.trim().length < 2) {
      errors.push(`Member ${index + 1}: Name is required`);
    }
    if (!member.email || !isValidEmail(member.email)) {
      errors.push(`Member ${index + 1}: Valid email is required`);
    }
    if (!member.phone || !isValidPhone(member.phone)) {
      errors.push(`Member ${index + 1}: Valid phone number is required`);
    }
    if (!member.university_reg || member.university_reg.trim().length < 3) {
      errors.push(`Member ${index + 1}: University registration number is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}
