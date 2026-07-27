'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { LOCALES, LOCALE_COOKIE, LOCALE_LABELS, type Locale } from '@/i18n/config';
import { useI18n } from '@/i18n/client';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, m } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (next: Locale) => {
    if (next === locale) return;
    // Persist for one year; read back on the server to render the chosen locale.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 text-navy-500"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
          d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <select
        aria-label={m.nav.changeLanguage}
        value={locale}
        disabled={isPending}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="cursor-pointer appearance-none rounded-lg border border-navy-100 bg-white py-2 pl-8 pr-8 text-sm font-medium text-navy-700 hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-60"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code].native}
          </option>
        ))}
      </select>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute right-2 text-navy-400"
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
