import { describe, it, expect } from 'vitest';
import { getAppointmentDateRange } from '@mta/shared';
import { createAppointmentFormSchema } from './appointmentForm';
import { en } from '@/i18n/messages/en';

const range = getAppointmentDateRange();
const appointmentFormSchema = createAppointmentFormSchema(en.validation);

const base = {
  specialtyId: 'a'.repeat(24),
  preferredDate: range.min,
  preferredTimePeriod: 'morning' as const,
  firstName: 'Maria',
  lastName: 'Ivanova',
  email: 'maria@example.com',
  country: 'Georgia',
  preferredContactMethod: 'telegram' as const,
  contactValue: '@maria_iv',
  consentAccepted: true,
};

describe('appointmentFormSchema', () => {
  it('accepts a valid form', () => {
    expect(appointmentFormSchema.safeParse(base).success).toBe(true);
  });

  it('enforces the date range (rejects past dates)', () => {
    expect(appointmentFormSchema.safeParse({ ...base, preferredDate: '2000-01-01' }).success).toBe(
      false,
    );
  });

  it('enforces the date range (rejects far-future dates)', () => {
    expect(appointmentFormSchema.safeParse({ ...base, preferredDate: '2099-01-01' }).success).toBe(
      false,
    );
  });

  it('accepts the maximum allowed date', () => {
    expect(appointmentFormSchema.safeParse({ ...base, preferredDate: range.max }).success).toBe(true);
  });

  it('requires consent', () => {
    expect(appointmentFormSchema.safeParse({ ...base, consentAccepted: false }).success).toBe(false);
  });

  it('validates whatsapp phone format', () => {
    expect(
      appointmentFormSchema.safeParse({
        ...base,
        preferredContactMethod: 'whatsapp',
        contactValue: 'abc',
      }).success,
    ).toBe(false);
    expect(
      appointmentFormSchema.safeParse({
        ...base,
        preferredContactMethod: 'whatsapp',
        contactValue: '+37412345678',
      }).success,
    ).toBe(true);
  });
});
