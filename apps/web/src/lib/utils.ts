import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from '@/i18n/config';

/** Merge Tailwind class names conditionally. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Maps an app locale to a BCP 47 tag for Intl formatting. */
const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-US',
  hy: 'hy-AM',
  ru: 'ru-RU',
};

function intlLocale(locale: Locale = 'en'): string {
  return INTL_LOCALES[locale] ?? 'en-US';
}

/** Common currency symbols — keeps SSR and client output identical. */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AMD: '֏',
  RUB: '₽',
};

/**
 * Locale-aware number formatting that does **not** use `Intl` currency style.
 * Node and browsers ship different ICU data for `hy-AM` / `ru-RU` currency,
 * which caused hydration mismatches (e.g. server `"55,00 $"` vs client `"$55.00"`).
 */
function formatAmount(price: number, locale: Locale): string {
  const negative = price < 0;
  const absolute = Math.abs(price);
  const fixed = absolute.toFixed(2);
  const [rawInt, fraction] = fixed.split('.');
  const dropFraction = fraction === '00';

  const groupSep = locale === 'en' ? ',' : '\u00A0';
  const decimalSep = locale === 'en' ? '.' : ',';

  const withGroups = rawInt.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
  const number = dropFraction ? withGroups : `${withGroups}${decimalSep}${fraction}`;
  return negative ? `-${number}` : number;
}

export function formatPrice(price?: number, currency?: string, locale: Locale = 'en'): string | null {
  if (price === undefined || price === null || Number.isNaN(price)) return null;
  const code = (currency ?? 'USD').toUpperCase();
  const symbol = CURRENCY_SYMBOLS[code] ?? code;
  const amount = formatAmount(price, locale);

  // en: "$55" / "$1,234.50" — hy/ru: "55 $" / "1 234,50 $"
  if (locale === 'en') {
    return `${symbol}${amount}`;
  }
  return `${amount}\u00A0${symbol}`;
}

export function formatDate(iso: string, locale: Locale = 'en'): string {
  try {
    return new Date(iso).toLocaleDateString(intlLocale(locale), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}
