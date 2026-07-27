/** Business timezone used for all appointment-date calculations. */
export const BUSINESS_TIMEZONE = 'Asia/Yerevan';

/** The maximum lead time for a preferred appointment date, in calendar months. */
export const APPOINTMENT_MAX_MONTHS_AHEAD = 1;

/** Field length limits shared by frontend and backend validation. */
export const FIELD_LIMITS = {
  firstName: { min: 1, max: 80 },
  lastName: { min: 1, max: 80 },
  email: { max: 254 },
  country: { min: 2, max: 80 },
  phoneNumber: { max: 30 },
  contactValue: { min: 3, max: 120 },
  message: { max: 1000 },
  medicalInformation: { max: 1000 },
  subject: { max: 160 },
  contactMessage: { max: 2000 },
  fullName: { min: 2, max: 160 },
} as const;

/** Default and maximum page sizes for paginated list endpoints. */
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 12,
  maxLimit: 100,
} as const;

/** Reference number prefix, e.g. ARM-2026-000123. */
export const REFERENCE_PREFIX = 'ARM';

/**
 * Notice shown near the appointment form. Kept here so the exact wording is
 * consistent across the app and easy to audit.
 */
export const SAFETY_NOTICE =
  'This platform is not an emergency medical service. Do not use this form for urgent medical situations. Please avoid submitting highly sensitive medical records through this form.';
