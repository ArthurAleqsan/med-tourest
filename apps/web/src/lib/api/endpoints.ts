import type {
  AppointmentPublicStatusDto,
  AppointmentSubmissionResult,
  DoctorDto,
  MedicalCenterDto,
  PackageDto,
  PaginatedData,
  SpecialtyDto,
} from '@mta/shared';
import type { AppointmentRequestInput, ContactRequestInput } from '@mta/shared';
import { apiRequest, toQuery } from './http';

// --- Public: specialties ---------------------------------------------------
export const getSpecialties = (search?: string) =>
  apiRequest<SpecialtyDto[]>(`/specialties${toQuery({ search })}`);

export const getSpecialty = (slug: string) => apiRequest<SpecialtyDto>(`/specialties/${slug}`);

// --- Public: medical centers ----------------------------------------------
export const getCenters = (search?: string) =>
  apiRequest<MedicalCenterDto[]>(`/centers${toQuery({ search })}`);

export const getCenter = (slug: string) => apiRequest<MedicalCenterDto>(`/centers/${slug}`);

// --- Public: packages -----------------------------------------------------
export const getPackages = (search?: string) =>
  apiRequest<PackageDto[]>(`/packages${toQuery({ search })}`);

export const getPackage = (slug: string) => apiRequest<PackageDto>(`/packages/${slug}`);

// --- Public: doctors -------------------------------------------------------
export interface DoctorListParams {
  search?: string;
  specialty?: string;
  language?: string;
  center?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export const getDoctors = (params: DoctorListParams = {}) =>
  apiRequest<PaginatedData<DoctorDto>>(`/doctors${toQuery({ ...params })}`);

export const getFeaturedDoctors = () => apiRequest<DoctorDto[]>('/doctors/featured');

export const getDoctor = (slug: string) =>
  apiRequest<{ doctor: DoctorDto; related: DoctorDto[] }>(`/doctors/${slug}`);

// --- Public: appointment & contact -----------------------------------------
export const submitAppointmentRequest = (body: AppointmentRequestInput) =>
  apiRequest<AppointmentSubmissionResult>('/appointment-requests', { method: 'POST', body });

export const getAppointmentStatus = (referenceNumber: string) =>
  apiRequest<AppointmentPublicStatusDto>(`/appointment-requests/${referenceNumber}`);

export const submitContactRequest = (body: ContactRequestInput) =>
  apiRequest<{ received: boolean }>('/contact-requests', { method: 'POST', body });
