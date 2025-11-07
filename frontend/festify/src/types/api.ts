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
  location: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  establishedYear: number | null;
  contactEmail: string | null;
  contactPhone: string | null;
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
  phone: string | null;
  bio: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollegeDTO {
  name: string;
  location: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  establishedYear?: number;
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateCollegeDTO {
  name?: string;
  location?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  establishedYear?: number;
  contactEmail?: string;
  contactPhone?: string;
}

export interface CreateProfileDTO {
  id: string; // Supabase user ID
  fullName: string;
  email: string;
  role: UserRole;
  college?: { id: string };
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  organizationName?: string;
  website?: string;
}

export interface UpdateProfileDTO {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  organizationName?: string;
  website?: string;
  role?: UserRole;
  college?: { id: string };
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
