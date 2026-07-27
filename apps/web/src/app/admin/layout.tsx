'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminSession } from '@/lib/useAdminSession';
import { AdminShell } from '@/components/admin/AdminShell';
import { Spinner } from '@/components/ui/feedback';
import { clearToken } from '@/lib/auth';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === '/admin/login';
  const { ready, token, user, isLoading, isError } = useAdminSession();

  useEffect(() => {
    if (isLoginRoute || !ready) return;
    if (!token || isError) {
      if (isError) clearToken();
      router.replace('/admin/login');
    }
  }, [isLoginRoute, ready, token, isError, router]);

  if (isLoginRoute) return <>{children}</>;

  if (!ready || isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50/40">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
