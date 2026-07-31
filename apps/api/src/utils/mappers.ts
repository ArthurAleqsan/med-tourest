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

type PopulatedSpecialtyRef = {
  _id: Types.ObjectId | string;
  en_name: string;
  ru_name: string;
  am_name: string;
  slug: string;
};

function isPopulatedSpecialtyRef(value: unknown): value is PopulatedSpecialtyRef {
  return (
    typeof value === 'object' &&
    value !== null &&
    'en_name' in value &&
    'slug' in value &&
    '_id' in value
  );
}

interface SpecialtyLean extends LeanBase {
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
  icon?: string | null;
  en_treatments?: string[] | null;
  ru_treatments?: string[] | null;
  am_treatments?: string[] | null;
  isActive: boolean;
  displayOrder: number;
}

export function toSpecialtyDto(doc: SpecialtyLean, doctorCount?: number): SpecialtyDto {
  return {
    id: id(doc._id),
    en_name: doc.en_name,
    ru_name: doc.ru_name,
    am_name: doc.am_name,
    slug: doc.slug,
    en_shortDescription: doc.en_shortDescription,
    ru_shortDescription: doc.ru_shortDescription,
    am_shortDescription: doc.am_shortDescription,
    en_description: doc.en_description,
    ru_description: doc.ru_description,
    am_description: doc.am_description,
    icon: doc.icon ?? undefined,
    en_treatments: doc.en_treatments ?? [],
    ru_treatments: doc.ru_treatments ?? [],
    am_treatments: doc.am_treatments ?? [],
    isActive: doc.isActive,
    displayOrder: doc.displayOrder,
    ...(doctorCount !== undefined ? { doctorCount } : {}),
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

interface MedicalCenterLean extends LeanBase {
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
    en_name: doc.en_name,
    ru_name: doc.ru_name,
    am_name: doc.am_name,
    slug: doc.slug,
    en_shortDescription: doc.en_shortDescription,
    ru_shortDescription: doc.ru_shortDescription,
    am_shortDescription: doc.am_shortDescription,
    en_description: doc.en_description,
    ru_description: doc.ru_description,
    am_description: doc.am_description,
    en_address: doc.en_address,
    ru_address: doc.ru_address,
    am_address: doc.am_address,
    en_city: doc.en_city,
    ru_city: doc.ru_city,
    am_city: doc.am_city,
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
  hotel: {
    en_name: string;
    ru_name: string;
    am_name: string;
    stars?: number | null;
    en_roomType?: string | null;
    ru_roomType?: string | null;
    am_roomType?: string | null;
    nights?: number | null;
    en_description?: string | null;
    ru_description?: string | null;
    am_description?: string | null;
  };
  tours?: Array<{
    en_title: string;
    ru_title: string;
    am_title: string;
    en_description: string;
    ru_description: string;
    am_description: string;
  }> | null;
  en_inclusions?: string[] | null;
  ru_inclusions?: string[] | null;
  am_inclusions?: string[] | null;
  priceFrom?: number | null;
  currency?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  displayOrder: number;
}

export function toPackageDto(doc: PackageLean): PackageDto {
  const hotel: PackageHotel = {
    en_name: doc.hotel?.en_name ?? '',
    ru_name: doc.hotel?.ru_name ?? '',
    am_name: doc.hotel?.am_name ?? '',
    stars: doc.hotel?.stars ?? undefined,
    en_roomType: doc.hotel?.en_roomType ?? undefined,
    ru_roomType: doc.hotel?.ru_roomType ?? undefined,
    am_roomType: doc.hotel?.am_roomType ?? undefined,
    nights: doc.hotel?.nights ?? undefined,
    en_description: doc.hotel?.en_description ?? undefined,
    ru_description: doc.hotel?.ru_description ?? undefined,
    am_description: doc.hotel?.am_description ?? undefined,
  };
  const tours: PackageTour[] = (doc.tours ?? []).map((tour) => ({
    en_title: tour.en_title,
    ru_title: tour.ru_title,
    am_title: tour.am_title,
    en_description: tour.en_description,
    ru_description: tour.ru_description,
    am_description: tour.am_description,
  }));
  return {
    id: id(doc._id),
    en_name: doc.en_name,
    ru_name: doc.ru_name,
    am_name: doc.am_name,
    slug: doc.slug,
    durationDays: doc.durationDays,
    en_shortDescription: doc.en_shortDescription,
    ru_shortDescription: doc.ru_shortDescription,
    am_shortDescription: doc.am_shortDescription,
    en_description: doc.en_description,
    ru_description: doc.ru_description,
    am_description: doc.am_description,
    hotel,
    tours,
    en_inclusions: doc.en_inclusions ?? [],
    ru_inclusions: doc.ru_inclusions ?? [],
    am_inclusions: doc.am_inclusions ?? [],
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
  en_name: string;
  ru_name: string;
  am_name: string;
  slug: string;
  en_city?: string | null;
  ru_city?: string | null;
  am_city?: string | null;
  en_address?: string | null;
  ru_address?: string | null;
  am_address?: string | null;
};

function isPopulatedCenter(value: unknown): value is PopulatedCenter {
  return (
    typeof value === 'object' &&
    value !== null &&
    'en_name' in value &&
    'slug' in value &&
    '_id' in value
  );
}

function centerRefs(value: unknown): MedicalCenterRef[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isPopulatedCenter).map((c) => ({
    id: id(c._id),
    en_name: c.en_name,
    ru_name: c.ru_name,
    am_name: c.am_name,
    slug: c.slug,
    en_city: c.en_city ?? undefined,
    ru_city: c.ru_city ?? undefined,
    am_city: c.am_city ?? undefined,
    en_address: c.en_address ?? undefined,
    ru_address: c.ru_address ?? undefined,
    am_address: c.am_address ?? undefined,
  }));
}

interface DoctorLean extends LeanBase {
  firstName: string;
  lastName: string;
  slug: string;
  specialty: PopulatedSpecialtyRef | Types.ObjectId | string;
  centers?: unknown;
  photoUrl?: string | null;
  en_shortDescription: string;
  ru_shortDescription: string;
  am_shortDescription: string;
  en_biography: string;
  ru_biography: string;
  am_biography: string;
  en_education?: string[] | null;
  ru_education?: string[] | null;
  am_education?: string[] | null;
  en_certifications?: string[] | null;
  ru_certifications?: string[] | null;
  am_certifications?: string[] | null;
  en_treatments?: string[] | null;
  ru_treatments?: string[] | null;
  am_treatments?: string[] | null;
  languages: string[];
  yearsOfExperience: number;
  consultationPrice?: number | null;
  consultationCurrency?: string | null;
  isFeatured: boolean;
  isActive: boolean;
}

function specialtyRef(value: PopulatedSpecialtyRef | Types.ObjectId | string): DoctorSpecialtyRef {
  if (isPopulatedSpecialtyRef(value)) {
    return {
      id: id(value._id),
      en_name: value.en_name,
      ru_name: value.ru_name,
      am_name: value.am_name,
      slug: value.slug,
    };
  }
  return { id: id(value), en_name: '', ru_name: '', am_name: '', slug: '' };
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
    en_shortDescription: doc.en_shortDescription,
    ru_shortDescription: doc.ru_shortDescription,
    am_shortDescription: doc.am_shortDescription,
    en_biography: doc.en_biography,
    ru_biography: doc.ru_biography,
    am_biography: doc.am_biography,
    en_education: doc.en_education ?? [],
    ru_education: doc.ru_education ?? [],
    am_education: doc.am_education ?? [],
    en_certifications: doc.en_certifications ?? [],
    ru_certifications: doc.ru_certifications ?? [],
    am_certifications: doc.am_certifications ?? [],
    en_treatments: doc.en_treatments ?? [],
    ru_treatments: doc.ru_treatments ?? [],
    am_treatments: doc.am_treatments ?? [],
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
  specialty: PopulatedSpecialtyRef | Types.ObjectId | string;
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
  const specialtyName = isPopulatedSpecialtyRef(doc.specialty) ? doc.specialty.en_name : '';
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
