'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { adminLogin } from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { setToken } from '@/lib/auth';
import { SiteLogo } from '@/components/layout/SiteLogo';
import { Field, Input } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => adminLogin(email, password),
    onSuccess: (data) => {
      setToken(data.token);
      router.replace('/admin');
    },
  });

  const error = mutation.error instanceof ApiRequestError ? mutation.error.message : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 shadow-card">
        <div className="mb-6 text-center">
          <div className="flex justify-center">
            <SiteLogo />
          </div>
          <h1 className="mt-4 text-xl font-bold text-navy-900">Admin sign in</h1>
          <p className="mt-1 text-sm text-navy-600">med.tourest coordination dashboard</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          {(error || mutation.isError) && (
            <Alert tone="error">{error ?? 'Unable to sign in. Please try again.'}</Alert>
          )}
          <Field label="Email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Password" htmlFor="password" required>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" fullWidth disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
