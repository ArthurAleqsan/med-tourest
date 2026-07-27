import type { Response } from 'express';
import type { ApiFieldError } from '@mta/shared';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
): Response {
  return res.status(statusCode).json({ success: true, data, ...(message ? { message } : {}) });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: ApiFieldError[],
): Response {
  return res.status(statusCode).json({ success: false, message, ...(errors ? { errors } : {}) });
}
