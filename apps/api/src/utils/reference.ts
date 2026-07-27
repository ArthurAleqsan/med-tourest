import { REFERENCE_PREFIX, getBusinessToday } from '@mta/shared';
import { nextSequence } from '../models/Counter';

/**
 * Generates a human-readable, unique appointment reference such as
 * `ARM-2026-000123`. The sequence is scoped per business year and incremented
 * atomically via a MongoDB counter document, preventing race conditions.
 */
export async function generateReferenceNumber(now: Date = new Date()): Promise<string> {
  const year = getBusinessToday(now).slice(0, 4);
  const seq = await nextSequence(`appointment-${year}`);
  return `${REFERENCE_PREFIX}-${year}-${String(seq).padStart(6, '0')}`;
}
