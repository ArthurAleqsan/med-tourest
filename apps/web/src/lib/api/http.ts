import type { ApiError, ApiResponse } from '@mta/shared';
import { API_URL } from '../config';

export class ApiRequestError extends Error {
  public readonly status: number;
  public readonly fieldErrors?: ApiError['errors'];

  constructor(status: number, message: string, fieldErrors?: ApiError['errors']) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
  /** Next.js fetch cache control; defaults to no-store for fresh data. */
  cache?: RequestCache;
  signal?: AbortSignal;
}

/**
 * Isomorphic typed API client. Works in both server and client components.
 * Always returns the `data` payload or throws an `ApiRequestError`.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, cache = 'no-store', signal } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache,
    signal,
  });

  let json: ApiResponse<T> | null = null;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    // Non-JSON response (e.g. gateway error).
  }

  if (!res.ok || !json || json.success === false) {
    const message = json && json.success === false ? json.message : `Request failed (${res.status})`;
    const errors = json && json.success === false ? json.errors : undefined;
    throw new ApiRequestError(res.status, message, errors);
  }

  return json.data;
}

/** Serializes a params object into a query string, skipping empty values. */
export function toQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '' || value === null) continue;
    search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : '';
}
