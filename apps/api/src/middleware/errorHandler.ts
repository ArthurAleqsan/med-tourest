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
  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyValue ?? { value: '' })[0] ?? 'value';
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
    stack: isProduction ? undefined : err instanceof Error ? err.stack : undefined,
  });
  sendError(res, 500, 'An unexpected error occurred');
}
