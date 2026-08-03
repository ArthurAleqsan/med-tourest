import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../config/logger';
import { isProduction } from '../config/env';

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.message, err.fieldErrors);
    return;
  }

  // Duplicate key (e.g. unique slug / reference / email).
  // Duck-type the driver error — `instanceof MongoServerError` is unreliable across bundlers.
  if (isMongoDuplicateKeyError(err)) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue ?? {};
    const field = Object.keys(keyValue)[0] ?? 'value';
    sendError(res, 409, 'A record with this value already exists.', [
      { field, message: 'Already exists.' },
    ]);
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    sendError(res, 400, 'Validation failed', errors);
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    sendError(res, 400, 'Invalid identifier format.', [{ field: err.path, message: 'Invalid id.' }]);
    return;
  }

  // Unexpected: log server-side, never leak internals to the client.
  logger.error('Unhandled error', {
    message: err instanceof Error ? err.message : 'unknown',
    name: err instanceof Error ? err.name : undefined,
    code: typeof err === 'object' && err && 'code' in err ? (err as { code: unknown }).code : undefined,
    stack: isProduction ? undefined : err instanceof Error ? err.stack : undefined,
  });
  sendError(res, 500, 'An unexpected error occurred');
}

function isMongoDuplicateKeyError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const code = (err as { code?: unknown }).code;
  if (code === 11000 || code === '11000') return true;
  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) return true;
  return false;
}
