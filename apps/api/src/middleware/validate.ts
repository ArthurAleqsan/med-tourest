import type { NextFunction, Request, Response } from 'express';
import type { ZodError, ZodTypeAny } from 'zod';
import type { ApiFieldError } from '@mta/shared';
import { ApiError } from '../utils/ApiError';

function toFieldErrors(error: ZodError): ApiFieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || '(root)',
    message: issue.message,
  }));
}

/**
 * Validates and replaces `req.body` with the parsed result.
 * Uses `safeParse` so it is robust even if the schema originates from a
 * different Zod module instance (e.g. the shared package).
 */
export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(ApiError.badRequest('Validation failed', toFieldErrors(result.error)));
      return;
    }
    req.validatedBody = result.data;
    next();
  };
}

/** Validates and stores the parsed query on `req.validatedQuery`. */
export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(ApiError.badRequest('Validation failed', toFieldErrors(result.error)));
      return;
    }
    req.validatedQuery = result.data;
    next();
  };
}
