'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Locale } from './config';
import type { Messages } from './messages';
import { interpolate, pluralize, type Vars } from './translate';
import type { PluralForms } from './types';

interface I18nValue {
  locale: Locale;
  m: Messages;
  t: (template: string, vars?: Vars) => string;
  plural: (count: number, forms: PluralForms, vars?: Vars) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      m: messages,
      t: (template, vars) => interpolate(template, vars),
      plural: (count, forms, vars) => pluralize(locale, count, forms, vars),
    }),
    [locale, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Access translations inside client components. */
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
