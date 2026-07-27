import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { adminRoleSchema } from '@mta/shared';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import type { AuthPayload } from '../types/express';

export function signAdminToken(payload: AuthPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

/** Verifies the Bearer token and attaches the admin payload to the request. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(ApiError.unauthorized('A valid Bearer token is required.'));
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === 'string' || !decoded.sub) {
      throw new Error('Invalid token payload');
    }
    const role = adminRoleSchema.parse(decoded.role);
    req.admin = {
      sub: String(decoded.sub),
      email: String((decoded as jwt.JwtPayload).email ?? ''),
      role,
    };
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token.'));
  }
}

/** Restricts a route to specific admin roles. */
export function requireRole(...roles: AuthPayload['role'][]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.admin) {
      next(ApiError.unauthorized());
      return;
    }
    if (!roles.includes(req.admin.role)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
}
