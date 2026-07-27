import { describe, it, expect } from 'vitest';
import {
  addDaysToDateOnly,
  addMonthsToDateOnly,
  getAppointmentDateRange,
  isValidDateOnly,
  validatePreferredDate,
} from './date';

// Fixed reference instant: 2026-07-15 09:00 UTC (13:00 in Asia/Yerevan, UTC+4).
const NOW = new Date('2026-07-15T09:00:00.000Z');

describe('date-only arithmetic', () => {
  it('adds days with month rollover', () => {
    expect(addDaysToDateOnly('2026-07-31', 1)).toBe('2026-08-01');
    expect(addDaysToDateOnly('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('adds one month and clamps short months', () => {
    expect(addMonthsToDateOnly('2026-07-15', 1)).toBe('2026-08-15');
    expect(addMonthsToDateOnly('2026-01-31', 1)).toBe('2026-02-28');
  });

  it('validates date-only strings', () => {
    expect(isValidDateOnly('2026-07-15')).toBe(true);
    expect(isValidDateOnly('2026-02-30')).toBe(false);
    expect(isValidDateOnly('2026-7-5')).toBe(false);
    expect(isValidDateOnly('not-a-date')).toBe(false);
  });
});

describe('appointment date range (Asia/Yerevan)', () => {
  it('computes min = tomorrow and max = one month ahead', () => {
    const range = getAppointmentDateRange(NOW);
    expect(range.min).toBe('2026-07-16');
    expect(range.max).toBe('2026-08-15');
  });

  it('handles the example from the specification', () => {
    const range = getAppointmentDateRange(new Date('2026-07-15T20:00:00.000Z'));
    // 20:00 UTC is 00:00 next day in Yerevan (UTC+4) -> "today" is 2026-07-16.
    expect(range.min).toBe('2026-07-17');
    expect(range.max).toBe('2026-08-16');
  });
});

describe('validatePreferredDate', () => {
  it('accepts a date inside the window', () => {
    expect(validatePreferredDate('2026-07-20', NOW).valid).toBe(true);
    expect(validatePreferredDate('2026-07-16', NOW).valid).toBe(true);
    expect(validatePreferredDate('2026-08-15', NOW).valid).toBe(true);
  });

  it('rejects today and past dates', () => {
    expect(validatePreferredDate('2026-07-15', NOW).valid).toBe(false);
    expect(validatePreferredDate('2026-07-01', NOW).valid).toBe(false);
  });

  it('rejects dates beyond one month', () => {
    expect(validatePreferredDate('2026-08-16', NOW).valid).toBe(false);
    expect(validatePreferredDate('2026-09-01', NOW).valid).toBe(false);
  });

  it('rejects malformed dates', () => {
    expect(validatePreferredDate('2026-13-01', NOW).valid).toBe(false);
  });
});
