'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { AdminUserDto } from '@mta/shared';
import { clearToken } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { SiteLogo } from '@/components/layout/SiteLogo';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/appointments', label: 'Appointment Requests' },
  { href: '/admin/doctors', label: 'Doctors' },
  { href: '/admin/centers', label: 'Medical Centers' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/specialties', label: 'Specialties' },
  { href: '/admin/contact-requests', label: 'Contact Requests' },
];

export function AdminShell({ user, children }: { user?: AdminUserDto; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    clearToken();
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen bg-navy-50/40">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3 font-semibold text-navy-900">
            <SiteLogo />
            <span className="hidden text-sm font-medium text-navy-500 sm:inline">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden text-sm text-navy-600 sm:inline">
                {user.firstName} {user.lastName} · {user.role}
              </span>
            )}
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-navy-100 px-3 py-1.5 text-sm font-medium text-navy-700 hover:bg-navy-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <nav aria-label="Admin" className="lg:w-56 lg:shrink-0">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {NAV.map((item) => {
              const active =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium',
                      active ? 'bg-brand-600 text-white' : 'text-navy-700 hover:bg-navy-100',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
