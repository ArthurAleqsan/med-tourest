import { APPOINTMENT_MAX_MONTHS_AHEAD, BUSINESS_TIMEZONE } from './constants';

/**
 * TIMEZONE HANDLING
 * -----------------
 * The preferred appointment date is a *calendar date* (no time-of-day). The
 * business operates in Armenia, so "today", "tomorrow" and "one month ahead"
 * are always computed in the `Asia/Yerevan` timezone, regardless of where the
 * patient or the server is physically located.
 *
 * On the wire, a preferred date is always a plain ISO date-only string
 * ("yyyy-MM-dd"). In MongoDB it is stored as a `Date` fixed to UTC midnight of
 * that calendar day, so it round-trips without drifting across timezones.
 *
 * All calendar arithmetic below is done with UTC getters/setters on a
 * `Date.UTC(...)` value. UTC has no DST, so date-only math is deterministic and
 * independent of the host machine's timezone.
 */

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Formats a Date as "yyyy-MM-dd" in the given IANA timezone (no date-fns). */
function formatDateOnlyInTimeZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  if (!year || !month || !day) {
    throw new Error(`Unable to format date in timezone ${timeZone}`);
  }
  return `${year}-${month}-${day}`;
}

export interface AppointmentDateRange {
  /** Earliest selectable calendar date (tomorrow, Yerevan) as "yyyy-MM-dd". */
  min: string;
  /** Latest selectable calendar date (today + 1 month, Yerevan) as "yyyy-MM-dd". */
  max: string;
}

/** Returns the current calendar date in the business timezone as "yyyy-MM-dd". */
export function getBusinessToday(now: Date = new Date()): string {
  return formatDateOnlyInTimeZone(now, BUSINESS_TIMEZONE);
}

function parseDateOnly(value: string): { year: number; month: number; day: number } {
  const [year, month, day] = value.split('-').map((part) => Number.parseInt(part, 10));
  return { year, month, day };
}

function formatUtc(date: Date): string {
  return formatDateOnlyInTimeZone(date, 'UTC');
}

function dateOnlyToUtc({ year, month, day }: { year: number; month: number; day: number }): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

/** Adds a number of days to a "yyyy-MM-dd" string, returning "yyyy-MM-dd". */
export function addDaysToDateOnly(value: string, days: number): string {
  const utc = dateOnlyToUtc(parseDateOnly(value));
  utc.setUTCDate(utc.getUTCDate() + days);
  return formatUtc(utc);
}

/**
 * Adds calendar months to a "yyyy-MM-dd" string. If the resulting month is
 * shorter than the source day (e.g. Jan 31 + 1 month), the day is clamped to
 * the last day of the target month.
 */
export function addMonthsToDateOnly(value: string, months: number): string {
  const { year, month, day } = parseDateOnly(value);
  const targetMonthIndex = month - 1 + months;
  const firstOfTarget = new Date(Date.UTC(year, targetMonthIndex, 1));
  const lastDayOfTarget = new Date(
    Date.UTC(firstOfTarget.getUTCFullYear(), firstOfTarget.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const clampedDay = Math.min(day, lastDayOfTarget);
  return formatUtc(
    new Date(Date.UTC(firstOfTarget.getUTCFullYear(), firstOfTarget.getUTCMonth(), clampedDay)),
  );
}

/**
 * Computes the allowed appointment date window.
 * - min = tomorrow (business timezone)
 * - max = today + APPOINTMENT_MAX_MONTHS_AHEAD calendar months (business timezone)
 */
export function getAppointmentDateRange(now: Date = new Date()): AppointmentDateRange {
  const today = getBusinessToday(now);
  return {
    min: addDaysToDateOnly(today, 1),
    max: addMonthsToDateOnly(today, APPOINTMENT_MAX_MONTHS_AHEAD),
  };
}

/** True when `value` is a syntactically valid "yyyy-MM-dd" calendar date. */
export function isValidDateOnly(value: string): boolean {
  if (!DATE_ONLY_REGEX.test(value)) return false;
  const { year, month, day } = parseDateOnly(value);
  const utc = dateOnlyToUtc({ year, month, day });
  return (
    utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day
  );
}

export interface DateValidationResult {
  valid: boolean;
  reason?: string;
  range: AppointmentDateRange;
}

/**
 * Validates a preferred appointment date against the allowed window.
 * Because ISO "yyyy-MM-dd" strings sort lexicographically, comparisons are
 * plain string comparisons — no timezone ambiguity.
 */
export function validatePreferredDate(
  value: string,
  now: Date = new Date(),
): DateValidationResult {
  const range = getAppointmentDateRange(now);
  if (!isValidDateOnly(value)) {
    return { valid: false, reason: 'Preferred date must be a valid calendar date.', range };
  }
  if (value < range.min) {
    return {
      valid: false,
      reason: 'Preferred date cannot be in the past. The earliest available date is tomorrow.',
      range,
    };
  }
  if (value > range.max) {
    return {
      valid: false,
      reason: 'Preferred date cannot be more than one month from today.',
      range,
    };
  }
  return { valid: true, range };
}

/** Converts a "yyyy-MM-dd" string to a Date at UTC midnight for storage. */
export function dateOnlyToStorageDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

/** Converts a stored Date back to a "yyyy-MM-dd" string. */
export function storageDateToDateOnly(date: Date): string {
  return formatUtc(date);
}
