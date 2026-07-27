'use client';

import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';

/** Returns the current admin token from storage (client-only). */
export function useToken(): string {
  const [token, setToken] = useState('');
  useEffect(() => {
    setToken(getToken() ?? '');
  }, []);
  return token;
}
