import { z } from 'zod';
import {
  ADMIN_ROLES,
  APPOINTMENT_STATUSES,
  CONTACT_METHODS,
  CONTACT_REQUEST_STATUSES,
  DOCTOR_SORT_OPTIONS,
  PREFERRED_TIME_PERIODS,
} from './enums';
import { FIELD_LIMITS, PAGINATION_DEFAULTS } from './constants';
import { isValidDateOnly, validatePreferredDate } from './date';

/** Collapses internal whitespace and strips control characters. */
const sanitize = (value: string): string =>
  // eslint-disable-next-line no-control-regex
  value.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();

const sanitizedString = (max: number, min = 0) =>
  z
    .string()
    .transform(sanitize)
    .pipe(
      z
        .string()
        .min(min, min > 0 ? `Must be at least ${min} characters.` : undefined)
        .max(max, `Must be at most ${max} characters.`),
    );

/** Multi-line text (message / medical info): trims but preserves newlines. */
const sanitizedText = (max: number) =>
  z
    .string()
    // eslint-disable-next-line no-control-regex
    .transform((v) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim())
    .pipe(z.string().max(max, `Must be at most ${max} characters.`));

const emailSchema = z
  .string()
  .transform((v) => v.trim().toLowerCase())
  .pipe(
    z
      .string()
      .min(1, 'A valid email address is required.')
      .max(FIELD_LIMITS.email.max)
      .email('A valid email address is required.'),
  );

const telegramRegex = /^@?[A-Za-z0-9_]{4,32}$/;
const phoneRegex = /^\+?[1-9]\d{6,14}$/;

// ---------------------------------------------------------------------------
// Appointment request
// ---------------------------------------------------------------------------

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Invalid identifier.');

export const appointmentRequestInputSchema = z
  .object({
    doctorId: objectIdSchema.optional(),
    specialtyId: objectIdSchema,
    preferredDate: z
      .string()
      .trim()
      .refine(isValidDateOnly, 'Preferred date must be a valid calendar date (YYYY-MM-DD).')
      .refine(
        (value) => validatePreferredDate(value).valid,
        (value) => ({ message: validatePreferredDate(value).reason ?? 'Invalid preferred date.' }),
      ),
    preferredTimePeriod: z.enum(PREFERRED_TIME_PERIODS),
    firstName: sanitizedString(FIELD_LIMITS.firstName.max, FIELD_LIMITS.firstName.min),
    lastName: sanitizedString(FIELD_LIMITS.lastName.max, FIELD_LIMITS.lastName.min),
    email: emailSchema,
    country: sanitizedString(FIELD_LIMITS.country.max, FIELD_LIMITS.country.min),
    phoneNumber: sanitizedString(FIELD_LIMITS.phoneNumber.max)
      .optional()
      .or(z.literal('').transform(() => undefined)),
    preferredContactMethod: z.enum(CONTACT_METHODS),
    contactValue: sanitizedString(FIELD_LIMITS.contactValue.max, FIELD_LIMITS.contactValue.min),
    message: sanitizedText(FIELD_LIMITS.message.max).optional(),
    medicalInformation: sanitizedText(FIELD_LIMITS.medicalInformation.max).optional(),
    consentAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must consent to the processing of your personal data.' }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.preferredContactMethod === 'telegram' && !telegramRegex.test(data.contactValue)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contactValue'],
        message: 'Enter a valid Telegram username, e.g. @username.',
      });
    }
    if (data.preferredContactMethod === 'whatsapp' && !phoneRegex.test(data.contactValue)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contactValue'],
        message: 'Enter a valid WhatsApp phone number in international format, e.g. +37412345678.',
      });
    }
  });

export type AppointmentRequestInput = z.infer<typeof appointmentRequestInputSchema>;

// ---------------------------------------------------------------------------
// Contact request
// ---------------------------------------------------------------------------

export const contactRequestInputSchema = z
  .object({
    fullName: sanitizedString(FIELD_LIMITS.fullName.max, FIELD_LIMITS.fullName.min),
    email: emailSchema,
    preferredContactMethod: z.enum(CONTACT_METHODS).optional(),
    contactValue: sanitizedString(FIELD_LIMITS.contactValue.max)
      .optional()
      .or(z.literal('').transform(() => undefined)),
    subject: sanitizedString(FIELD_LIMITS.subject.max)
      .optional()
      .or(z.literal('').transform(() => undefined)),
    message: sanitizedText(FIELD_LIMITS.contactMessage.max).pipe(
      z.string().min(1, 'A message is required.'),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.preferredContactMethod && !data.contactValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contactValue'],
        message: 'Please provide your contact details for the selected method.',
      });
    }
  });

export type ContactRequestInput = z.infer<typeof contactRequestInputSchema>;

// ---------------------------------------------------------------------------
// Admin: doctor
// ---------------------------------------------------------------------------

export const doctorInputSchema = z.object({
  firstName: sanitizedString(FIELD_LIMITS.firstName.max, FIELD_LIMITS.firstName.min),
  lastName: sanitizedString(FIELD_LIMITS.lastName.max, FIELD_LIMITS.lastName.min),
  specialty: objectIdSchema,
  centerIds: z
    .array(objectIdSchema)
    .min(1, 'Select at least one medical center.')
    .max(20, 'A doctor can be linked to at most 20 centers.'),
  photoUrl: z.string().trim().url('Photo URL must be a valid URL.').max(500).optional().or(z.literal('').transform(() => undefined)),
  shortDescription: sanitizedText(280).pipe(z.string().min(10, 'Short description is too short.')),
  biography: sanitizedText(4000).pipe(z.string().min(20, 'Biography is too short.')),
  education: z.array(sanitizedString(200, 1)).max(20).default([]),
  certifications: z.array(sanitizedString(200, 1)).max(20).default([]),
  treatments: z.array(sanitizedString(120, 1)).max(40).default([]),
  languages: z.array(sanitizedString(40, 1)).min(1, 'At least one language is required.').max(15),
  yearsOfExperience: z.number().int().min(0).max(70),
  consultationPrice: z.number().min(0).max(100000).optional(),
  consultationCurrency: z.string().trim().length(3, 'Use a 3-letter ISO currency code.').toUpperCase().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type DoctorInput = z.infer<typeof doctorInputSchema>;
export const doctorUpdateSchema = doctorInputSchema.partial();
export type DoctorUpdateInput = z.infer<typeof doctorUpdateSchema>;

// ---------------------------------------------------------------------------
// Admin: specialty
// ---------------------------------------------------------------------------

export const specialtyInputSchema = z.object({
  name: sanitizedString(120, 2),
  shortDescription: sanitizedText(280).pipe(z.string().min(10, 'Short description is too short.')),
  description: sanitizedText(4000).pipe(z.string().min(20, 'Description is too short.')),
  icon: sanitizedString(60).optional(),
  treatments: z.array(sanitizedString(120, 1)).max(40).default([]),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).max(9999).default(0),
});

export type SpecialtyInput = z.infer<typeof specialtyInputSchema>;
export const specialtyUpdateSchema = specialtyInputSchema.partial();
export type SpecialtyUpdateInput = z.infer<typeof specialtyUpdateSchema>;

// ---------------------------------------------------------------------------
// Admin: medical center
// ---------------------------------------------------------------------------

export const medicalCenterInputSchema = z.object({
  name: sanitizedString(160, 2),
  shortDescription: sanitizedText(280).pipe(z.string().min(10, 'Short description is too short.')),
  description: sanitizedText(4000).pipe(z.string().min(20, 'Description is too short.')),
  address: sanitizedString(240, 3),
  city: sanitizedString(120, 2),
  phone: sanitizedString(FIELD_LIMITS.phoneNumber.max)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  email: emailSchema.optional().or(z.literal('').transform(() => undefined)),
  website: z
    .string()
    .trim()
    .url('Website must be a valid URL.')
    .max(500)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  photoUrl: z
    .string()
    .trim()
    .url('Photo URL must be a valid URL.')
    .max(500)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).max(9999).default(0),
});

export type MedicalCenterInput = z.infer<typeof medicalCenterInputSchema>;
export const medicalCenterUpdateSchema = medicalCenterInputSchema.partial();
export type MedicalCenterUpdateInput = z.infer<typeof medicalCenterUpdateSchema>;

// ---------------------------------------------------------------------------
// Admin: package (treatment + travel bundle)
// ---------------------------------------------------------------------------

const packageTourSchema = z.object({
  title: sanitizedString(160, 2),
  description: sanitizedText(600).pipe(z.string().min(3, 'Tour description is too short.')),
});

const packageHotelSchema = z.object({
  name: sanitizedString(160, 2),
  stars: z.number().int().min(1).max(5).optional(),
  roomType: sanitizedString(120)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  nights: z.number().int().min(0).max(90).optional(),
  description: sanitizedText(1000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export const packageInputSchema = z.object({
  name: sanitizedString(160, 2),
  durationDays: z.number().int().min(1, 'Duration must be at least 1 day.').max(90),
  shortDescription: sanitizedText(280).pipe(z.string().min(10, 'Short description is too short.')),
  description: sanitizedText(6000).pipe(z.string().min(20, 'Description is too short.')),
  hotel: packageHotelSchema,
  tours: z.array(packageTourSchema).max(30).default([]),
  inclusions: z.array(sanitizedString(160, 1)).max(40).default([]),
  priceFrom: z.number().min(0).max(1000000).optional(),
  currency: z.string().trim().length(3, 'Use a 3-letter ISO currency code.').toUpperCase().optional(),
  photoUrl: z
    .string()
    .trim()
    .url('Photo URL must be a valid URL.')
    .max(500)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).max(9999).default(0),
});

export type PackageInput = z.infer<typeof packageInputSchema>;
export const packageUpdateSchema = packageInputSchema.partial();
export type PackageUpdateInput = z.infer<typeof packageUpdateSchema>;

// ---------------------------------------------------------------------------
// Admin: auth + status updates
// ---------------------------------------------------------------------------

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.').max(200),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const appointmentStatusUpdateSchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES),
  internalNotes: sanitizedText(4000).optional(),
});
export type AppointmentStatusUpdateInput = z.infer<typeof appointmentStatusUpdateSchema>;

export const appointmentAdminUpdateSchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  internalNotes: sanitizedText(4000).optional(),
});
export type AppointmentAdminUpdateInput = z.infer<typeof appointmentAdminUpdateSchema>;

export const contactStatusUpdateSchema = z.object({
  status: z.enum(CONTACT_REQUEST_STATUSES),
});
export type ContactStatusUpdateInput = z.infer<typeof contactStatusUpdateSchema>;

// ---------------------------------------------------------------------------
// Query schemas (coerced from URL query strings)
// ---------------------------------------------------------------------------

const pageSchema = z.coerce.number().int().min(1).default(PAGINATION_DEFAULTS.page);
const limitSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(PAGINATION_DEFAULTS.maxLimit)
  .default(PAGINATION_DEFAULTS.limit);

export const doctorListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  specialty: z.string().trim().max(120).optional(),
  language: z.string().trim().max(40).optional(),
  center: z.string().trim().max(160).optional(),
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  page: pageSchema,
  limit: limitSchema,
  sort: z.enum(DOCTOR_SORT_OPTIONS).default('experience_desc'),
});
export type DoctorListQuery = z.infer<typeof doctorListQuerySchema>;

export const specialtyListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
});
export type SpecialtyListQuery = z.infer<typeof specialtyListQuerySchema>;

export const centerListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
});
export type CenterListQuery = z.infer<typeof centerListQuerySchema>;

export const packageListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
});
export type PackageListQuery = z.infer<typeof packageListQuerySchema>;

export const appointmentAdminListQuerySchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  doctorId: z.string().trim().max(40).optional(),
  specialtyId: z.string().trim().max(40).optional(),
  email: z.string().trim().max(254).optional(),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  page: pageSchema,
  limit: limitSchema,
  sort: z.enum(['createdAt_desc', 'createdAt_asc', 'preferredDate_asc', 'preferredDate_desc']).default('createdAt_desc'),
});
export type AppointmentAdminListQuery = z.infer<typeof appointmentAdminListQuerySchema>;

export const adminRoleSchema = z.enum(ADMIN_ROLES);
