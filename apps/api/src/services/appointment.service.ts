import type {
  AppointmentAdminListQuery,
  AppointmentAdminUpdateInput,
  AppointmentPublicStatusDto,
  AppointmentRequestDto,
  AppointmentRequestInput,
  AppointmentStatusUpdateInput,
  AppointmentSubmissionResult,
  PaginatedData,
} from '@mta/shared';
import { dateOnlyToStorageDate, validatePreferredDate } from '@mta/shared';
import { AppointmentRequest } from '../models/AppointmentRequest';
import { Doctor } from '../models/Doctor';
import { Specialty } from '../models/Specialty';
import { ApiError } from '../utils/ApiError';
import { generateReferenceNumber } from '../utils/reference';
import { toAppointmentDto, toAppointmentPublicStatusDto } from '../utils/mappers';
import { paginated } from '../utils/pagination';

const DOCTOR_REF_FIELDS = 'firstName lastName slug';
const SPECIALTY_REF_FIELDS = 'en_name ru_name am_name slug';

export async function createAppointmentRequest(
  input: AppointmentRequestInput,
): Promise<AppointmentSubmissionResult> {
  // Authoritative server-side date check (defence in depth alongside Zod).
  const dateCheck = validatePreferredDate(input.preferredDate);
  if (!dateCheck.valid) {
    throw ApiError.badRequest('Validation failed', [
      { field: 'preferredDate', message: dateCheck.reason ?? 'Invalid preferred date.' },
    ]);
  }

  let specialtyId = input.specialtyId;

  if (input.doctorId) {
    const doctor = await Doctor.findOne({ _id: input.doctorId, isActive: true })
      .select('specialty')
      .lean();
    if (!doctor) {
      throw ApiError.badRequest('Validation failed', [
        { field: 'doctorId', message: 'Selected doctor is not available.' },
      ]);
    }
    // The doctor's specialty is authoritative.
    specialtyId = String(doctor.specialty);
  } else {
    const specialty = await Specialty.findOne({ _id: specialtyId, isActive: true })
      .select('_id')
      .lean();
    if (!specialty) {
      throw ApiError.badRequest('Validation failed', [
        { field: 'specialtyId', message: 'Selected specialty is not available.' },
      ]);
    }
  }

  const referenceNumber = await generateReferenceNumber();

  const created = await AppointmentRequest.create({
    referenceNumber,
    doctor: input.doctorId,
    specialty: specialtyId,
    preferredDate: dateOnlyToStorageDate(input.preferredDate),
    preferredTimePeriod: input.preferredTimePeriod,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    country: input.country,
    phoneNumber: input.phoneNumber,
    preferredContactMethod: input.preferredContactMethod,
    contactValue: input.contactValue,
    message: input.message,
    medicalInformation: input.medicalInformation,
    consentAccepted: input.consentAccepted,
    status: 'new',
  });

  return {
    referenceNumber: created.referenceNumber,
    status: created.status,
    preferredDate: input.preferredDate,
    preferredTimePeriod: created.preferredTimePeriod,
    createdAt: created.createdAt.toISOString(),
  };
}

export async function getPublicAppointmentStatus(
  referenceNumber: string,
): Promise<AppointmentPublicStatusDto> {
  const doc = await AppointmentRequest.findOne({ referenceNumber })
    .select('referenceNumber status preferredDate createdAt doctor specialty')
    .populate('doctor', DOCTOR_REF_FIELDS)
    .populate('specialty', SPECIALTY_REF_FIELDS)
    .lean();
  if (!doc) throw ApiError.notFound('No appointment request found for this reference number.');
  return toAppointmentPublicStatusDto(doc);
}

export async function listAppointmentRequests(
  query: AppointmentAdminListQuery,
): Promise<PaginatedData<AppointmentRequestDto>> {
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.doctorId) filter.doctor = query.doctorId;
  if (query.specialtyId) filter.specialty = query.specialtyId;
  if (query.email) filter.email = query.email.toLowerCase();
  if (query.dateFrom || query.dateTo) {
    const range: Record<string, Date> = {};
    if (query.dateFrom) range.$gte = new Date(`${query.dateFrom}T00:00:00.000Z`);
    if (query.dateTo) range.$lte = new Date(`${query.dateTo}T23:59:59.999Z`);
    filter.preferredDate = range;
  }

  const sortMap: Record<AppointmentAdminListQuery['sort'], Record<string, 1 | -1>> = {
    createdAt_desc: { createdAt: -1 },
    createdAt_asc: { createdAt: 1 },
    preferredDate_asc: { preferredDate: 1 },
    preferredDate_desc: { preferredDate: -1 },
  };

  const skip = (query.page - 1) * query.limit;
  const [docs, totalItems] = await Promise.all([
    AppointmentRequest.find(filter)
      .populate('doctor', DOCTOR_REF_FIELDS)
      .populate('specialty', SPECIALTY_REF_FIELDS)
      .sort(sortMap[query.sort])
      .skip(skip)
      .limit(query.limit)
      .lean(),
    AppointmentRequest.countDocuments(filter),
  ]);

  return paginated(docs.map(toAppointmentDto), query.page, query.limit, totalItems);
}

export async function getAppointmentById(id: string): Promise<AppointmentRequestDto> {
  const doc = await AppointmentRequest.findById(id)
    .populate('doctor', DOCTOR_REF_FIELDS)
    .populate('specialty', SPECIALTY_REF_FIELDS)
    .lean();
  if (!doc) throw ApiError.notFound('Appointment request not found.');
  return toAppointmentDto(doc);
}

export async function updateAppointmentStatus(
  id: string,
  input: AppointmentStatusUpdateInput,
): Promise<AppointmentRequestDto> {
  const doc = await AppointmentRequest.findById(id);
  if (!doc) throw ApiError.notFound('Appointment request not found.');
  doc.status = input.status;
  if (input.internalNotes !== undefined) doc.internalNotes = input.internalNotes;
  await doc.save();
  return getAppointmentById(id);
}

export async function updateAppointment(
  id: string,
  input: AppointmentAdminUpdateInput,
): Promise<AppointmentRequestDto> {
  const doc = await AppointmentRequest.findById(id);
  if (!doc) throw ApiError.notFound('Appointment request not found.');
  if (input.status !== undefined) doc.status = input.status;
  if (input.internalNotes !== undefined) doc.internalNotes = input.internalNotes;
  await doc.save();
  return getAppointmentById(id);
}
