/**
 * API Types for Festify Backend Integration
 * Auto-generated based on Spring Boot entities
 */

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ParticipationType {
  INDIVIDUAL = 'INDIVIDUAL',
  TEAM = 'TEAM',
  BOTH = 'BOTH'
}

export enum UserRole {
  ATTENDEE = 'ATTENDEE',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN'
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  iconName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface College {
  id: string;
  name: string;
  location: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  collegeId: string | null;
  college?: College;
  organizationName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: string;
  category: Category;
  collegeId: string;
  college: College;
  organizerId: string;
  organizer: Profile;
  startDate: string;
  endDate: string;
  location: string;
  venueDetails: string | null;
  participationType: ParticipationType;
  eventStatus: EventStatus;
  teamSizeMin: number;
  teamSizeMax: number;
  maxAttendees: number | null;
  currentAttendees: number;
  registrationDeadline: string | null;
  featured: boolean;
  global: boolean;
  individualPrice: number;
  teamBasePrice: number;
  pricePerMember: number;
  hasCustomTeamPricing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDTO {
  title: string;
  description?: string;
  imageUrl?: string;
  category: { id: string };
  college: { id: string };
  organizer: { id: string };
  startDate: string;
  endDate: string;
  location: string;
  venueDetails?: string;
  participationType: ParticipationType;
  eventStatus: EventStatus;
  teamSizeMin: number;
  teamSizeMax: number;
  maxAttendees?: number;
  registrationDeadline?: string;
  featured?: boolean;
  global?: boolean;
  individualPrice?: number;
  teamBasePrice?: number;
  pricePerMember?: number;
  hasCustomTeamPricing?: boolean;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  imageUrl?: string;
  category?: { id: string };
  college?: { id: string };
  startDate?: string;
  endDate?: string;
  location?: string;
  venueDetails?: string;
  participationType?: ParticipationType;
  eventStatus?: EventStatus;
  teamSizeMin?: number;
  teamSizeMax?: number;
  maxAttendees?: number;
  registrationDeadline?: string;
  featured?: boolean;
  global?: boolean;
  individualPrice?: number;
  teamBasePrice?: number;
  pricePerMember?: number;
  hasCustomTeamPricing?: boolean;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  iconName?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  iconName?: string;
}

// API Response Types
export interface ApiError {
  message: string;
  error?: string;
  status?: number;
}
