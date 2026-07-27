import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from './config';
import { getMessages, type Messages } from './messages';
import { interpolate, pluralize, type Vars } from './translate';
import type { PluralForms } from './types';

/** Reads the active locale from the request cookie (server components only). */
export function getLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export interface Translator {
  locale: Locale;
  m: Messages;
  t: (template: string, vars?: Vars) => string;
  plural: (count: number, forms: PluralForms, vars?: Vars) => string;
}

/** Returns the messages and helpers for the given (or current) locale. */
export function getTranslations(locale: Locale = getLocale()): Translator {
  const m = getMessages(locale);
  return {
    locale,
    m,
    t: (template, vars) => interpolate(template, vars),
    plural: (count, forms, vars) => pluralize(locale, count, forms, vars),
  };
}
