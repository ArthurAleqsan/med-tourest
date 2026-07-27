import type { Messages } from '@/i18n/messages';

export const LANGUAGES = [
  'Armenian',
  'English',
  'Russian',
  'French',
  'Arabic',
  'Persian',
] as const;

/** Translates a known spoken-language name, falling back to the raw value. */
export function translateLanguage(m: Messages, language: string): string {
  const map = m.languages as Record<string, string>;
  return map[language] ?? language;
}
