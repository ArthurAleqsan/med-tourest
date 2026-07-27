import type { AdminRole } from '@mta/shared';

export interface AuthPayload {
  sub: string;
  email: string;
  role: AdminRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedQuery?: unknown;
      admin?: AuthPayload;
    }
  }
}

export {};
