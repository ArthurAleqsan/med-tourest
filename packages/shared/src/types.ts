import type {
  AdminRole,
  AppointmentStatus,
  ContactMethod,
  ContactRequestStatus,
  PreferredTimePeriod,
} from './enums';

// ---------------------------------------------------------------------------
// API response envelopes
// ---------------------------------------------------------------------------

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: ApiFieldError[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Public DTOs
// ---------------------------------------------------------------------------

export interface SpecialtyDto {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  treatments: string[];
  isActive: boolean;
  displayOrder: number;
  doctorCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSpecialtyRef {
  id: string;
  name: string;
  slug: string;
}

export interface MedicalCenterRef {
  id: string;
  name: string;
  slug: string;
  city?: string;
  address?: string;
}

export interface MedicalCenterDto {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  website?: string;
  photoUrl?: string;
  isActive: boolean;
  displayOrder: number;
  doctorCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PackageTour {
  title: string;
  description: string;
}

export interface PackageHotel {
  name: string;
  stars?: number;
  roomType?: string;
  nights?: number;
  description?: string;
}

export interface PackageDto {
  id: string;
  name: string;
  slug: string;
  durationDays: number;
  shortDescription: string;
  description: string;
  hotel: PackageHotel;
  tours: PackageTour[];
  inclusions: string[];
  priceFrom?: number;
  currency?: string;
  photoUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  slug: string;
  specialty: DoctorSpecialtyRef;
  centers: MedicalCenterRef[];
  photoUrl?: string;
  shortDescription: string;
  biography: string;
  education: string[];
  certifications: string[];
  treatments: string[];
  languages: string[];
  yearsOfExperience: number;
  consultationPrice?: number;
  consultationCurrency?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Full appointment record returned to admins only. */
export interface AppointmentRequestDto {
  id: string;
  referenceNumber: string;
  doctor?: DoctorSpecialtyRef & { fullName: string };
  specialty: DoctorSpecialtyRef;
  preferredDate: string;
  preferredTimePeriod: PreferredTimePeriod;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber?: string;
  preferredContactMethod: ContactMethod;
  contactValue: string;
  message?: string;
  medicalInformation?: string;
  consentAccepted: boolean;
  status: AppointmentStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Confirmation returned right after a public submission. */
export interface AppointmentSubmissionResult {
  referenceNumber: string;
  status: AppointmentStatus;
  preferredDate: string;
  preferredTimePeriod: PreferredTimePeriod;
  createdAt: string;
}

/** Safe, public status-lookup payload (no private contact/medical data). */
export interface AppointmentPublicStatusDto {
  referenceNumber: string;
  status: AppointmentStatus;
  doctorName?: string;
  specialtyName: string;
  preferredDate: string;
  createdAt: string;
}

export interface ContactRequestDto {
  id: string;
  fullName: string;
  email: string;
  preferredContactMethod?: ContactMethod;
  contactValue?: string;
  subject?: string;
  message: string;
  status: ContactRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginResult {
  token: string;
  user: AdminUserDto;
}

export interface HealthStatus {
  status: 'ok' | 'degraded';
  uptime: number;
  timestamp: string;
  database: 'connected' | 'disconnected';
}

export interface AdminDashboardSummary {
  totalDoctors: number;
  totalActiveDoctors: number;
  totalSpecialties: number;
  newAppointmentRequests: number;
  totalAppointmentRequests: number;
  newContactRequests: number;
  upcomingAppointments: Array<{
    id: string;
    referenceNumber: string;
    preferredDate: string;
    doctorName?: string;
    specialtyName: string;
    status: AppointmentStatus;
  }>;
}
