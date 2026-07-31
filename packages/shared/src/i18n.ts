/** Content locales stored on CMS entities (Armenian uses `am`). */
export const CONTENT_LOCALES = ['en', 'ru', 'am'] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];

/** UI locales on the public site (`hy` maps to content locale `am`). */
export type UiLocale = 'en' | 'hy' | 'ru';

export function uiLocaleToContent(locale: UiLocale | string): ContentLocale {
  if (locale === 'hy' || locale === 'am') return 'am';
  if (locale === 'ru') return 'ru';
  return 'en';
}

export type LocalizedFields<T extends string> = {
  [L in ContentLocale as `${L}_${T}`]: string;
};

export type LocalizedArrayFields<T extends string> = {
  [L in ContentLocale as `${L}_${T}`]: string[];
};

/** Pick a localized string with English fallback. */
export function pickLocalized(
  record: Partial<Record<`${ContentLocale}_${string}`, string | undefined>> &
    Record<string, unknown>,
  field: string,
  locale: UiLocale | ContentLocale | string,
): string {
  const content = uiLocaleToContent(locale);
  const preferred = record[`${content}_${field}`];
  if (typeof preferred === 'string' && preferred.trim()) return preferred;
  const en = record[`en_${field}`];
  if (typeof en === 'string') return en;
  return '';
}

/** Pick a localized string array with English fallback. */
export function pickLocalizedArray(
  record: Partial<Record<`${ContentLocale}_${string}`, string[] | undefined>> &
    Record<string, unknown>,
  field: string,
  locale: UiLocale | ContentLocale | string,
): string[] {
  const content = uiLocaleToContent(locale);
  const preferred = record[`${content}_${field}`];
  if (Array.isArray(preferred) && preferred.length > 0) return preferred;
  const en = record[`en_${field}`];
  return Array.isArray(en) ? en : [];
}
