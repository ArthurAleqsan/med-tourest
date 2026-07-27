'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminMe } from '@/lib/api/endpoints';
import { getToken } from '@/lib/auth';

/** Reads the stored token on the client and validates it against /auth/me. */
export function useAdminSession() {
  const [token, setTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTokenState(getToken());
    setReady(true);
  }, []);

  const query = useQuery({
    queryKey: ['admin', 'me', token],
    queryFn: () => adminMe(token as string),
    enabled: ready && Boolean(token),
    retry: false,
  });

  return {
    ready,
    token,
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
