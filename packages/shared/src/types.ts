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
  en_name: string;
  ru_name: string;
  am_name: string;
  slug: string;
  en_shortDescription: string;
  ru_shortDescription: string;
  am_shortDescription: string;
  en_description: string;
  ru_description: string;
  am_description: string;
  icon?: string;
  en_treatments: string[];
  ru_treatments: string[];
  am_treatments: string[];
  isActive: boolean;
  displayOrder: number;
  doctorCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSpecialtyRef {
  id: string;
  en_name: string;
  ru_name: string;
  am_name: string;
  slug: string;
}

export interface MedicalCenterRef {
  id: string;
  en_name: string;
  ru_name: string;
  am_name: string;
  slug: string;
  en_city?: string;
  ru_city?: string;
  am_city?: string;
  en_address?: string;
  ru_address?: string;
  am_address?: string;
}

export interface MedicalCenterDto {
  id: string;
  en_name: string;
  ru_name: string;
  am_name: string;
  slug: string;
  en_shortDescription: string;
  ru_shortDescription: string;
  am_shortDescription: string;
  en_description: string;
  ru_description: string;
  am_description: string;
  en_address: string;
  ru_address: string;
  am_address: string;
  en_city: string;
  ru_city: string;
  am_city: string;
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
  en_title: string;
  ru_title: string;
  am_title: string;
  en_description: string;
  ru_description: string;
  am_description: string;
}

export interface PackageHotel {
  en_name: string;
  ru_name: string;
  am_name: string;
  stars?: number;
  en_roomType?: string;
  ru_roomType?: string;
  am_roomType?: string;
  nights?: number;
  en_description?: string;
  ru_description?: string;
  am_description?: string;
}

export interface PackageDto {
  id: string;
  en_name: string;
  ru_name: string;
  am_name: string;
  slug: string;
  durationDays: number;
  en_shortDescription: string;
  ru_shortDescription: string;
  am_shortDescription: string;
  en_description: string;
  ru_description: string;
  am_description: string;
  hotel: PackageHotel;
  tours: PackageTour[];
  en_inclusions: string[];
  ru_inclusions: string[];
  am_inclusions: string[];
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
  en_shortDescription: string;
  ru_shortDescription: string;
  am_shortDescription: string;
  en_biography: string;
  ru_biography: string;
  am_biography: string;
  en_education: string[];
  ru_education: string[];
  am_education: string[];
  en_certifications: string[];
  ru_certifications: string[];
  am_certifications: string[];
  en_treatments: string[];
  ru_treatments: string[];
  am_treatments: string[];
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
  doctor?: { id: string; fullName: string; slug: string };
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
