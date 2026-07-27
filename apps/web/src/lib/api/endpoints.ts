import type {
  AdminDashboardSummary,
  AdminLoginResult,
  AppointmentPublicStatusDto,
  AppointmentRequestDto,
  AppointmentSubmissionResult,
  ContactRequestDto,
  DoctorDto,
  MedicalCenterDto,
  PackageDto,
  PaginatedData,
  SpecialtyDto,
} from '@mta/shared';
import type {
  AppointmentRequestInput,
  ContactRequestInput,
  DoctorInput,
  MedicalCenterInput,
  PackageInput,
  SpecialtyInput,
} from '@mta/shared';
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

// --- Admin -----------------------------------------------------------------
export const adminLogin = (email: string, password: string) =>
  apiRequest<AdminLoginResult>('/admin/auth/login', {
    method: 'POST',
    body: { email, password },
  });

export const adminMe = (token: string) =>
  apiRequest<AdminLoginResult['user']>('/admin/auth/me', { token });

export const adminDashboard = (token: string) =>
  apiRequest<AdminDashboardSummary>('/admin/dashboard', { token });

export const adminListDoctors = (token: string, params: DoctorListParams = {}) =>
  apiRequest<PaginatedData<DoctorDto>>(`/admin/doctors${toQuery({ ...params })}`, { token });

export const adminGetDoctor = (token: string, id: string) =>
  apiRequest<DoctorDto>(`/admin/doctors/${id}`, { token });

export const adminListSpecialties = (token: string) =>
  apiRequest<SpecialtyDto[]>('/admin/specialties', { token });

export const adminGetSpecialty = (token: string, id: string) =>
  apiRequest<SpecialtyDto>(`/admin/specialties/${id}`, { token });

export const adminCreateDoctor = (token: string, body: DoctorInput) =>
  apiRequest<DoctorDto>('/admin/doctors', { method: 'POST', body, token });

export const adminUpdateDoctor = (token: string, id: string, body: Partial<DoctorInput>) =>
  apiRequest<DoctorDto>(`/admin/doctors/${id}`, { method: 'PATCH', body, token });

export const adminDeleteDoctor = (token: string, id: string) =>
  apiRequest<{ deleted: boolean }>(`/admin/doctors/${id}`, { method: 'DELETE', token });

export const adminCreateSpecialty = (token: string, body: SpecialtyInput) =>
  apiRequest<SpecialtyDto>('/admin/specialties', { method: 'POST', body, token });

export const adminUpdateSpecialty = (token: string, id: string, body: Partial<SpecialtyInput>) =>
  apiRequest<SpecialtyDto>(`/admin/specialties/${id}`, { method: 'PATCH', body, token });

export const adminDeleteSpecialty = (token: string, id: string) =>
  apiRequest<{ deleted: boolean }>(`/admin/specialties/${id}`, { method: 'DELETE', token });

// --- Admin: medical centers -----------------------------------------------
export const adminListCenters = (token: string) =>
  apiRequest<MedicalCenterDto[]>('/admin/centers', { token });

export const adminGetCenter = (token: string, id: string) =>
  apiRequest<MedicalCenterDto>(`/admin/centers/${id}`, { token });

export const adminCreateCenter = (token: string, body: MedicalCenterInput) =>
  apiRequest<MedicalCenterDto>('/admin/centers', { method: 'POST', body, token });

export const adminUpdateCenter = (token: string, id: string, body: Partial<MedicalCenterInput>) =>
  apiRequest<MedicalCenterDto>(`/admin/centers/${id}`, { method: 'PATCH', body, token });

export const adminDeleteCenter = (token: string, id: string) =>
  apiRequest<{ deleted: boolean }>(`/admin/centers/${id}`, { method: 'DELETE', token });

// --- Admin: packages ------------------------------------------------------
export const adminListPackages = (token: string) =>
  apiRequest<PackageDto[]>('/admin/packages', { token });

export const adminGetPackage = (token: string, id: string) =>
  apiRequest<PackageDto>(`/admin/packages/${id}`, { token });

export const adminCreatePackage = (token: string, body: PackageInput) =>
  apiRequest<PackageDto>('/admin/packages', { method: 'POST', body, token });

export const adminUpdatePackage = (token: string, id: string, body: Partial<PackageInput>) =>
  apiRequest<PackageDto>(`/admin/packages/${id}`, { method: 'PATCH', body, token });

export const adminDeletePackage = (token: string, id: string) =>
  apiRequest<{ deleted: boolean }>(`/admin/packages/${id}`, { method: 'DELETE', token });

export interface AdminAppointmentListParams {
  status?: string;
  doctorId?: string;
  specialtyId?: string;
  email?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const adminListAppointments = (token: string, params: AdminAppointmentListParams = {}) =>
  apiRequest<PaginatedData<AppointmentRequestDto>>(
    `/admin/appointment-requests${toQuery({ ...params })}`,
    { token },
  );

export const adminGetAppointment = (token: string, id: string) =>
  apiRequest<AppointmentRequestDto>(`/admin/appointment-requests/${id}`, { token });

export const adminUpdateAppointmentStatus = (
  token: string,
  id: string,
  status: string,
  internalNotes?: string,
) =>
  apiRequest<AppointmentRequestDto>(`/admin/appointment-requests/${id}/status`, {
    method: 'PATCH',
    body: { status, ...(internalNotes !== undefined ? { internalNotes } : {}) },
    token,
  });

export const adminListContacts = (token: string, page = 1, limit = 20) =>
  apiRequest<PaginatedData<ContactRequestDto>>(
    `/admin/contact-requests${toQuery({ page, limit })}`,
    { token },
  );

export const adminUpdateContactStatus = (token: string, id: string, status: string) =>
  apiRequest<ContactRequestDto>(`/admin/contact-requests/${id}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  });
