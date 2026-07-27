/**
 * Domain enums shared between the API and the web app.
 * These are declared as const objects + union types so they can be used
 * both as runtime values (e.g. Mongoose enum validation) and static types.
 */

export const APPOINTMENT_STATUSES = [
  'new',
  'contacted',
  'pending_confirmation',
  'confirmed',
  'cancelled',
  'completed',
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const PREFERRED_TIME_PERIODS = [
  'morning',
  'afternoon',
  'evening',
  'no_preference',
] as const;
export type PreferredTimePeriod = (typeof PREFERRED_TIME_PERIODS)[number];

export const CONTACT_METHODS = ['telegram', 'whatsapp'] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const CONTACT_REQUEST_STATUSES = ['new', 'reviewed', 'closed'] as const;
export type ContactRequestStatus = (typeof CONTACT_REQUEST_STATUSES)[number];

export const ADMIN_ROLES = ['admin', 'coordinator'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const DOCTOR_SORT_OPTIONS = [
  'experience_desc',
  'experience_asc',
  'name_asc',
  'name_desc',
] as const;
export type DoctorSortOption = (typeof DOCTOR_SORT_OPTIONS)[number];

/** Human-readable labels for time periods, useful in UI and admin. */
export const TIME_PERIOD_LABELS: Record<PreferredTimePeriod, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  no_preference: 'No preference',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  pending_confirmation: 'Pending confirmation',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};
