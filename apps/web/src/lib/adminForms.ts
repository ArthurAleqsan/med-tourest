import { z } from 'zod';

/** Splits a textarea value into a trimmed, non-empty array (one item per line). */
export function linesToArray(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function arrayToLines(items: string[] | undefined): string {
  return (items ?? []).join('\n');
}

const locNameFields = {
  en_name: z.string().min(2, 'Name is required.'),
  ru_name: z.string().min(2, 'Name is required.'),
  am_name: z.string().min(2, 'Name is required.'),
};

const locShortFields = {
  en_shortDescription: z.string().min(10, 'Short description is too short.'),
  ru_shortDescription: z.string().min(10, 'Short description is too short.'),
  am_shortDescription: z.string().min(10, 'Short description is too short.'),
};

const locDescriptionFields = {
  en_description: z.string().min(20, 'Description is too short.'),
  ru_description: z.string().min(20, 'Description is too short.'),
  am_description: z.string().min(20, 'Description is too short.'),
};

const locAddressFields = {
  en_address: z.string().min(3, 'Address is required.'),
  ru_address: z.string().min(3, 'Address is required.'),
  am_address: z.string().min(3, 'Address is required.'),
};

const locCityFields = {
  en_city: z.string().min(2, 'City is required.'),
  ru_city: z.string().min(2, 'City is required.'),
  am_city: z.string().min(2, 'City is required.'),
};

const locOptionalHotelFields = {
  en_hotelRoomType: z.string().optional().or(z.literal('')),
  ru_hotelRoomType: z.string().optional().or(z.literal('')),
  am_hotelRoomType: z.string().optional().or(z.literal('')),
  en_hotelDescription: z.string().optional().or(z.literal('')),
  ru_hotelDescription: z.string().optional().or(z.literal('')),
  am_hotelDescription: z.string().optional().or(z.literal('')),
};

const packageTourFormSchema = z.object({
  en_title: z.string().min(2, 'Tour title is required.'),
  ru_title: z.string().min(2, 'Tour title is required.'),
  am_title: z.string().min(2, 'Tour title is required.'),
  en_description: z.string().min(3, 'Tour description is too short.'),
  ru_description: z.string().min(3, 'Tour description is too short.'),
  am_description: z.string().min(3, 'Tour description is too short.'),
});

export const doctorFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  specialty: z.string().min(1, 'Specialty is required.'),
  centerIds: z.array(z.string()).min(1, 'Select at least one medical center.'),
  photoUrl: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
  ...locShortFields,
  en_biography: z.string().min(20, 'Biography is too short.'),
  ru_biography: z.string().min(20, 'Biography is too short.'),
  am_biography: z.string().min(20, 'Biography is too short.'),
  en_education: z.string().optional(),
  ru_education: z.string().optional(),
  am_education: z.string().optional(),
  en_certifications: z.string().optional(),
  ru_certifications: z.string().optional(),
  am_certifications: z.string().optional(),
  en_treatments: z.string().optional(),
  ru_treatments: z.string().optional(),
  am_treatments: z.string().optional(),
  languages: z.string().min(1, 'Add at least one language.'),
  yearsOfExperience: z.coerce.number().int().min(0).max(70),
  consultationPrice: z
    .union([z.coerce.number().min(0), z.literal('')])
    .optional(),
  consultationCurrency: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;

export const specialtyFormSchema = z.object({
  ...locNameFields,
  ...locShortFields,
  ...locDescriptionFields,
  icon: z.string().optional(),
  en_treatments: z.string().optional(),
  ru_treatments: z.string().optional(),
  am_treatments: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

export type SpecialtyFormValues = z.infer<typeof specialtyFormSchema>;

export const centerFormSchema = z.object({
  ...locNameFields,
  ...locShortFields,
  ...locDescriptionFields,
  ...locAddressFields,
  ...locCityFields,
  phone: z.string().optional(),
  email: z.string().email('Must be a valid email.').or(z.literal('')).optional(),
  website: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
  photoUrl: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
  displayOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

export type CenterFormValues = z.infer<typeof centerFormSchema>;

export const packageFormSchema = z.object({
  ...locNameFields,
  durationDays: z.coerce.number().int().min(1, 'Duration must be at least 1 day.').max(90),
  ...locShortFields,
  ...locDescriptionFields,
  en_hotelName: z.string().min(2, 'Hotel name is required.'),
  ru_hotelName: z.string().min(2, 'Hotel name is required.'),
  am_hotelName: z.string().min(2, 'Hotel name is required.'),
  hotelStars: z
    .union([z.coerce.number().int().min(1).max(5), z.literal('')])
    .optional(),
  hotelNights: z
    .union([z.coerce.number().int().min(0).max(90), z.literal('')])
    .optional(),
  ...locOptionalHotelFields,
  tours: z.array(packageTourFormSchema).max(30),
  en_inclusions: z.string().optional(),
  ru_inclusions: z.string().optional(),
  am_inclusions: z.string().optional(),
  priceFrom: z.union([z.coerce.number().min(0), z.literal('')]).optional(),
  currency: z.string().optional(),
  photoUrl: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
  displayOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

export type PackageFormValues = z.infer<typeof packageFormSchema>;

export const LOCALES = ['en', 'ru', 'am'] as const;
export type AdminContentLocale = (typeof LOCALES)[number];

export const LOCALE_SECTION_LABELS: Record<AdminContentLocale, string> = {
  en: 'English',
  ru: 'Russian',
  am: 'Armenian',
};
