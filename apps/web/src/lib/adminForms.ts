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

export const doctorFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  specialty: z.string().min(1, 'Specialty is required.'),
  centerIds: z.array(z.string()).min(1, 'Select at least one medical center.'),
  photoUrl: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
  shortDescription: z.string().min(10, 'Short description is too short.'),
  biography: z.string().min(20, 'Biography is too short.'),
  education: z.string().optional(),
  certifications: z.string().optional(),
  treatments: z.string().optional(),
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
  name: z.string().min(2, 'Name is required.'),
  shortDescription: z.string().min(10, 'Short description is too short.'),
  description: z.string().min(20, 'Description is too short.'),
  icon: z.string().optional(),
  treatments: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

export type SpecialtyFormValues = z.infer<typeof specialtyFormSchema>;

export const centerFormSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  shortDescription: z.string().min(10, 'Short description is too short.'),
  description: z.string().min(20, 'Description is too short.'),
  address: z.string().min(3, 'Address is required.'),
  city: z.string().min(2, 'City is required.'),
  phone: z.string().optional(),
  email: z.string().email('Must be a valid email.').or(z.literal('')).optional(),
  website: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
  photoUrl: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
  displayOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

export type CenterFormValues = z.infer<typeof centerFormSchema>;

export const packageFormSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  durationDays: z.coerce.number().int().min(1, 'Duration must be at least 1 day.').max(90),
  shortDescription: z.string().min(10, 'Short description is too short.'),
  description: z.string().min(20, 'Description is too short.'),
  hotelName: z.string().min(2, 'Hotel name is required.'),
  hotelStars: z
    .union([z.coerce.number().int().min(1).max(5), z.literal('')])
    .optional(),
  hotelRoomType: z.string().optional(),
  hotelNights: z
    .union([z.coerce.number().int().min(0).max(90), z.literal('')])
    .optional(),
  hotelDescription: z.string().optional(),
  tours: z
    .array(
      z.object({
        title: z.string().min(2, 'Tour title is required.'),
        description: z.string().min(3, 'Tour description is too short.'),
      }),
    )
    .max(30),
  inclusions: z.string().optional(),
  priceFrom: z.union([z.coerce.number().min(0), z.literal('')]).optional(),
  currency: z.string().optional(),
  photoUrl: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
  displayOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

export type PackageFormValues = z.infer<typeof packageFormSchema>;
