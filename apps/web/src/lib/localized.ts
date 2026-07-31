import { pickLocalized, pickLocalizedArray, CONTENT_LOCALES } from '@mta/shared';
import type { Locale } from '@/i18n/config';

export { pickLocalized, pickLocalizedArray, CONTENT_LOCALES };

/** Pick a localized string for the given UI locale (`hy` maps to content `am`). */
export function loc(record: object, field: string, locale: Locale): string {
  return pickLocalized(record as Parameters<typeof pickLocalized>[0], field, locale);
}

/** Pick a localized string array for the given UI locale. */
export function locArray(record: object, field: string, locale: Locale): string[] {
  return pickLocalizedArray(record as Parameters<typeof pickLocalizedArray>[0], field, locale);
}
