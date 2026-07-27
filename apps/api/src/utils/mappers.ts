import type { Types } from 'mongoose';
import type {
  AdminUserDto,
  AppointmentPublicStatusDto,
  AppointmentRequestDto,
  ContactRequestDto,
  DoctorDto,
  DoctorSpecialtyRef,
  MedicalCenterDto,
  MedicalCenterRef,
  PackageDto,
  PackageHotel,
  PackageTour,
  SpecialtyDto,
} from '@mta/shared';
import { storageDateToDateOnly } from '@mta/shared';

/** Minimal shape shared by all mapped lean documents. */
interface LeanBase {
  _id: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const id = (value: Types.ObjectId | string): string => String(value);
const iso = (value: Date): string => new Date(value).toISOString();

type PopulatedRef = { _id: Types.ObjectId | string; name: string; slug: string };

function isPopulatedRef(value: unknown): value is PopulatedRef {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'slug' in value &&
    '_id' in value
  );
}

interface SpecialtyLean extends LeanBase {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string | null;
  treatments: string[];
  isActive: boolean;
  displayOrder: number;
}

export function toSpecialtyDto(doc: SpecialtyLean, doctorCount?: number): SpecialtyDto {
  return {
    id: id(doc._id),
    name: doc.name,
    slug: doc.slug,
    shortDescription: doc.shortDescription,
    description: doc.description,
    icon: doc.icon ?? undefined,
    treatments: doc.treatments ?? [],
    isActive: doc.isActive,
    displayOrder: doc.displayOrder,
    ...(doctorCount !== undefined ? { doctorCount } : {}),
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

interface MedicalCenterLean extends LeanBase {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  address: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  displayOrder: number;
}

export function toMedicalCenterDto(doc: MedicalCenterLean, doctorCount?: number): MedicalCenterDto {
  return {
    id: id(doc._id),
    name: doc.name,
    slug: doc.slug,
    shortDescription: doc.shortDescription,
    description: doc.description,
    address: doc.address,
    city: doc.city,
    phone: doc.phone ?? undefined,
    email: doc.email ?? undefined,
    website: doc.website ?? undefined,
    photoUrl: doc.photoUrl ?? undefined,
    isActive: doc.isActive,
    displayOrder: doc.displayOrder,
    ...(doctorCount !== undefined ? { doctorCount } : {}),
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

interface PackageLean extends LeanBase {
  name: string;
  slug: string;
  durationDays: number;
  shortDescription: string;
  description: string;
  hotel: {
    name: string;
    stars?: number | null;
    roomType?: string | null;
    nights?: number | null;
    description?: string | null;
  };
  tours?: Array<{ title: string; description: string }> | null;
  inclusions?: string[] | null;
  priceFrom?: number | null;
  currency?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  displayOrder: number;
}

export function toPackageDto(doc: PackageLean): PackageDto {
  const hotel: PackageHotel = {
    name: doc.hotel?.name ?? '',
    stars: doc.hotel?.stars ?? undefined,
    roomType: doc.hotel?.roomType ?? undefined,
    nights: doc.hotel?.nights ?? undefined,
    description: doc.hotel?.description ?? undefined,
  };
  const tours: PackageTour[] = (doc.tours ?? []).map((tour) => ({
    title: tour.title,
    description: tour.description,
  }));
  return {
    id: id(doc._id),
    name: doc.name,
    slug: doc.slug,
    durationDays: doc.durationDays,
    shortDescription: doc.shortDescription,
    description: doc.description,
    hotel,
    tours,
    inclusions: doc.inclusions ?? [],
    priceFrom: doc.priceFrom ?? undefined,
    currency: doc.currency ?? undefined,
    photoUrl: doc.photoUrl ?? undefined,
    isActive: doc.isActive,
    displayOrder: doc.displayOrder,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

type PopulatedCenter = {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
  city?: string | null;
  address?: string | null;
};

function isPopulatedCenter(value: unknown): value is PopulatedCenter {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'slug' in value &&
    '_id' in value
  );
}

function centerRefs(value: unknown): MedicalCenterRef[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isPopulatedCenter).map((c) => ({
    id: id(c._id),
    name: c.name,
    slug: c.slug,
    city: c.city ?? undefined,
    address: c.address ?? undefined,
  }));
}

interface DoctorLean extends LeanBase {
  firstName: string;
  lastName: string;
  slug: string;
  specialty: PopulatedRef | Types.ObjectId | string;
  centers?: unknown;
  photoUrl?: string | null;
  shortDescription: string;
  biography: string;
  education: string[];
  certifications: string[];
  treatments: string[];
  languages: string[];
  yearsOfExperience: number;
  consultationPrice?: number | null;
  consultationCurrency?: string | null;
  isFeatured: boolean;
  isActive: boolean;
}

function specialtyRef(value: PopulatedRef | Types.ObjectId | string): DoctorSpecialtyRef {
  if (isPopulatedRef(value)) {
    return { id: id(value._id), name: value.name, slug: value.slug };
  }
  return { id: id(value), name: '', slug: '' };
}

export function toDoctorDto(doc: DoctorLean): DoctorDto {
  return {
    id: id(doc._id),
    firstName: doc.firstName,
    lastName: doc.lastName,
    fullName: `${doc.firstName} ${doc.lastName}`,
    slug: doc.slug,
    specialty: specialtyRef(doc.specialty),
    centers: centerRefs(doc.centers),
    photoUrl: doc.photoUrl ?? undefined,
    shortDescription: doc.shortDescription,
    biography: doc.biography,
    education: doc.education ?? [],
    certifications: doc.certifications ?? [],
    treatments: doc.treatments ?? [],
    languages: doc.languages ?? [],
    yearsOfExperience: doc.yearsOfExperience,
    consultationPrice: doc.consultationPrice ?? undefined,
    consultationCurrency: doc.consultationCurrency ?? undefined,
    isFeatured: doc.isFeatured,
    isActive: doc.isActive,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

interface DoctorRefLean {
  _id: Types.ObjectId | string;
  firstName: string;
  lastName: string;
  slug: string;
}

interface AppointmentLean extends LeanBase {
  referenceNumber: string;
  doctor?: (DoctorRefLean & { specialty?: unknown }) | Types.ObjectId | string | null;
  specialty: PopulatedRef | Types.ObjectId | string;
  preferredDate: Date;
  preferredTimePeriod: AppointmentRequestDto['preferredTimePeriod'];
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber?: string | null;
  preferredContactMethod: AppointmentRequestDto['preferredContactMethod'];
  contactValue: string;
  message?: string | null;
  medicalInformation?: string | null;
  consentAccepted: boolean;
  status: AppointmentRequestDto['status'];
  internalNotes?: string | null;
}

function isDoctorRef(value: unknown): value is DoctorRefLean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'firstName' in value &&
    'lastName' in value &&
    'slug' in value
  );
}

export function toAppointmentDto(doc: AppointmentLean): AppointmentRequestDto {
  const doctor = isDoctorRef(doc.doctor)
    ? {
        id: id(doc.doctor._id),
        name: `${doc.doctor.firstName} ${doc.doctor.lastName}`,
        slug: doc.doctor.slug,
        fullName: `${doc.doctor.firstName} ${doc.doctor.lastName}`,
      }
    : undefined;

  return {
    id: id(doc._id),
    referenceNumber: doc.referenceNumber,
    doctor,
    specialty: specialtyRef(doc.specialty),
    preferredDate: storageDateToDateOnly(doc.preferredDate),
    preferredTimePeriod: doc.preferredTimePeriod,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    country: doc.country,
    phoneNumber: doc.phoneNumber ?? undefined,
    preferredContactMethod: doc.preferredContactMethod,
    contactValue: doc.contactValue,
    message: doc.message ?? undefined,
    medicalInformation: doc.medicalInformation ?? undefined,
    consentAccepted: doc.consentAccepted,
    status: doc.status,
    internalNotes: doc.internalNotes ?? undefined,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

/** Public, privacy-safe projection of an appointment (no contact/medical data). */
export function toAppointmentPublicStatusDto(doc: AppointmentLean): AppointmentPublicStatusDto {
  const doctorName = isDoctorRef(doc.doctor)
    ? `${doc.doctor.firstName} ${doc.doctor.lastName}`
    : undefined;
  const specialtyName = isPopulatedRef(doc.specialty) ? doc.specialty.name : '';
  return {
    referenceNumber: doc.referenceNumber,
    status: doc.status,
    doctorName,
    specialtyName,
    preferredDate: storageDateToDateOnly(doc.preferredDate),
    createdAt: iso(doc.createdAt),
  };
}

interface ContactLean extends LeanBase {
  fullName: string;
  email: string;
  preferredContactMethod?: ContactRequestDto['preferredContactMethod'] | null;
  contactValue?: string | null;
  subject?: string | null;
  message: string;
  status: ContactRequestDto['status'];
}

export function toContactDto(doc: ContactLean): ContactRequestDto {
  return {
    id: id(doc._id),
    fullName: doc.fullName,
    email: doc.email,
    preferredContactMethod: doc.preferredContactMethod ?? undefined,
    contactValue: doc.contactValue ?? undefined,
    subject: doc.subject ?? undefined,
    message: doc.message,
    status: doc.status,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

interface AdminLean extends LeanBase {
  email: string;
  firstName: string;
  lastName: string;
  role: AdminUserDto['role'];
  isActive: boolean;
}

export function toAdminUserDto(doc: AdminLean): AdminUserDto {
  return {
    id: id(doc._id),
    email: doc.email,
    firstName: doc.firstName,
    lastName: doc.lastName,
    role: doc.role,
    isActive: doc.isActive,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}
