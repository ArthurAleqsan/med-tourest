import { describe, it, expect } from 'vitest';
import { appointmentRequestInputSchema, contactRequestInputSchema } from './schemas';
import { getAppointmentDateRange } from './date';

const validDate = getAppointmentDateRange().min;

const baseAppointment = {
  specialtyId: 'a'.repeat(24),
  preferredDate: validDate,
  preferredTimePeriod: 'morning' as const,
  firstName: '  Maria ',
  lastName: 'Ivanova',
  email: 'MARIA@Example.com',
  country: 'Georgia',
  preferredContactMethod: 'telegram' as const,
  contactValue: '@maria_iv',
  consentAccepted: true as const,
};

describe('appointmentRequestInputSchema', () => {
  it('accepts and normalizes a valid payload', () => {
    const result = appointmentRequestInputSchema.safeParse(baseAppointment);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('maria@example.com');
      expect(result.data.firstName).toBe('Maria');
    }
  });

  it('requires consent to be accepted', () => {
    const result = appointmentRequestInputSchema.safeParse({
      ...baseAppointment,
      consentAccepted: false,
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid telegram username', () => {
    const result = appointmentRequestInputSchema.safeParse({
      ...baseAppointment,
      contactValue: 'no spaces allowed!',
    });
    expect(result.success).toBe(false);
  });

  it('requires a valid whatsapp number when whatsapp is chosen', () => {
    const bad = appointmentRequestInputSchema.safeParse({
      ...baseAppointment,
      preferredContactMethod: 'whatsapp',
      contactValue: 'not-a-number',
    });
    expect(bad.success).toBe(false);

    const good = appointmentRequestInputSchema.safeParse({
      ...baseAppointment,
      preferredContactMethod: 'whatsapp',
      contactValue: '+37412345678',
    });
    expect(good.success).toBe(true);
  });

  it('rejects an out-of-range preferred date', () => {
    const result = appointmentRequestInputSchema.safeParse({
      ...baseAppointment,
      preferredDate: '2000-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = appointmentRequestInputSchema.safeParse({
      ...baseAppointment,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });
});

describe('contactRequestInputSchema', () => {
  it('accepts a minimal valid message', () => {
    const result = contactRequestInputSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, I have a question.',
    });
    expect(result.success).toBe(true);
  });

  it('requires a message', () => {
    const result = contactRequestInputSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      message: '',
    });
    expect(result.success).toBe(false);
  });
});
