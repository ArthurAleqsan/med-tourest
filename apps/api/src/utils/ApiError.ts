import type { ApiFieldError } from '@mta/shared';

/** Application-level error carrying an HTTP status and optional field errors. */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly fieldErrors?: ApiFieldError[];
  public readonly expose: boolean;

  constructor(statusCode: number, message: string, fieldErrors?: ApiFieldError[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    // 4xx errors are safe to expose to clients; 5xx are not.
    this.expose = statusCode < 500;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message: string, fieldErrors?: ApiFieldError[]): ApiError {
    return new ApiError(400, message, fieldErrors);
  }

  static unauthorized(message = 'Authentication is required.'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'You do not have permission to perform this action.'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found.'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string, fieldErrors?: ApiFieldError[]): ApiError {
    return new ApiError(409, message, fieldErrors);
  }
}
