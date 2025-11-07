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

export enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  ATTENDED = 'ATTENDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
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

export interface Registration {
  id: string;
  eventId: string;
  event?: Event;
  userId: string;
  user?: Profile;
  registrationStatus: RegistrationStatus;
  registrationDate: string;
  attendedAt: string | null;
  notes: string | null;
  team: boolean;
  teamSize: number | null;
  teamName: string | null;
  teamLeaderName: string | null;
  teamLeaderPhone: string | null;
  teamLeaderEmail: string | null;
  teamLeaderUniversityReg: string | null;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  paymentMethod: string | null;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  eventId: string;
  event?: Event;
  teamLeaderId: string | null;
  teamLeader?: Profile;
  registrationId: string;
  registration?: Registration;
  teamName: string;
  teamLeaderName: string;
  teamLeaderPhone: string | null;
  teamLeaderEmail: string | null;
  teamLeaderUniversityReg: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegistrationDTO {
  event: { id: string };
  user: { id: string };
  registrationStatus?: RegistrationStatus;
  registrationDate?: string;
  notes?: string;
  team?: boolean;
  teamSize?: number;
  teamName?: string;
  teamLeaderName?: string;
  teamLeaderPhone?: string;
  teamLeaderEmail?: string;
  teamLeaderUniversityReg?: string;
  paymentStatus?: PaymentStatus;
  paymentAmount?: number;
  paymentMethod?: string;
}

export interface UpdateRegistrationDTO {
  registrationStatus?: RegistrationStatus;
  attendedAt?: string;
  notes?: string;
  teamSize?: number;
  teamName?: string;
  teamLeaderName?: string;
  teamLeaderPhone?: string;
  teamLeaderEmail?: string;
  teamLeaderUniversityReg?: string;
  paymentStatus?: PaymentStatus;
  paymentAmount?: number;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
}

export interface CreateTeamDTO {
  event: { id: string };
  teamLeader?: { id: string };
  registration: { id: string };
  teamName: string;
  teamLeaderName: string;
  teamLeaderPhone?: string;
  teamLeaderEmail?: string;
  teamLeaderUniversityReg?: string;
}

export interface UpdateTeamDTO {
  teamName?: string;
  teamLeaderName?: string;
  teamLeaderPhone?: string;
  teamLeaderEmail?: string;
  teamLeaderUniversityReg?: string;
}

// API Response Types
export interface ApiError {
  message: string;
  error?: string;
  status?: number;
}
