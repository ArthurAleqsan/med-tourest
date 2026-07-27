import type { Locale } from './config';
import type { PluralForms } from './types';

export type Vars = Record<string, string | number>;

/** Replaces `{placeholder}` tokens in a template with the provided values. */
export function interpolate(template: string, vars: Vars = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** Picks the correct plural form for `count` in `locale` and interpolates it. */
export function pluralize(
  locale: Locale,
  count: number,
  forms: PluralForms,
  vars: Vars = {},
): string {
  const category = new Intl.PluralRules(locale).select(count) as keyof PluralForms;
  const template = forms[category] ?? forms.other;
  return interpolate(template, { count, ...vars });
}
