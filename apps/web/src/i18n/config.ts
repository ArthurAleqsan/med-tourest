export const LOCALES = ['en', 'hy', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Cookie used to persist the visitor's language choice. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const LOCALE_LABELS: Record<Locale, { native: string; short: string; english: string }> = {
  en: { native: 'English', short: 'EN', english: 'English' },
  hy: { native: 'Հայերեն', short: 'ՀԱՅ', english: 'Armenian' },
  ru: { native: 'Русский', short: 'РУС', english: 'Russian' },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
