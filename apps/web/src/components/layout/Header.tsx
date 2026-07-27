'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { SiteLogo } from '@/components/layout/SiteLogo';
import { SITE_NAME } from '@/lib/config';
import { useI18n } from '@/i18n/client';
import { cn } from '@/lib/utils';

export function Header() {
  const [open, setOpen] = useState(false);
  const { m, t } = useI18n();

  const navLinks = [
    { href: '/', label: m.nav.home },
    { href: '/doctors', label: m.nav.doctors },
    { href: '/centers', label: m.nav.centers },
    { href: '/packages', label: m.nav.packages },
    { href: '/#specialties', label: m.nav.specialties },
    { href: '/#how-it-works', label: m.nav.howItWorks },
    { href: '/#why-armenia', label: m.nav.whyArmenia },
    { href: '/contact', label: m.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100/70 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-[6.25rem] items-center justify-between sm:h-28">
          <Link
            href="/"
            className="flex items-center"
            aria-label={t(m.nav.homeAria, { site: SITE_NAME })}
          >
            <SiteLogo size="lg" priority />
          </Link>

          <nav aria-label={m.nav.primary} className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 hover:text-navy-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <LinkButton href="/appointments/request">{m.nav.bookAppointment}</LinkButton>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-navy-700 hover:bg-navy-50 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={m.nav.toggleMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        className={cn('border-t border-navy-100 bg-white lg:hidden', open ? 'block' : 'hidden')}
      >
        <Container>
          <nav aria-label={m.nav.mobile} className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-navy-700 hover:bg-navy-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
            <LinkButton href="/appointments/request" className="mt-2" fullWidth>
              {m.nav.bookAppointment}
            </LinkButton>
          </nav>
        </Container>
      </div>
    </header>
  );
}
