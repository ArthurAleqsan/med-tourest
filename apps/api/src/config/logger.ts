import morgan from 'morgan';
import type { RequestHandler } from 'express';
import { isProduction, isTest } from './env';

/** Minimal structured logger. Avoids logging request bodies to protect PII. */
export const logger = {
  info: (message: string, meta?: Record<string, unknown>): void => {
    if (isTest) return;
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ level: 'info', message, ...meta, ts: new Date().toISOString() }));
  },
  warn: (message: string, meta?: Record<string, unknown>): void => {
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify({ level: 'warn', message, ...meta, ts: new Date().toISOString() }));
  },
  error: (message: string, meta?: Record<string, unknown>): void => {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify({ level: 'error', message, ...meta, ts: new Date().toISOString() }),
    );
  },
};

/**
 * HTTP request logger. Deliberately logs only method, URL, status and response
 * time — never request bodies — so medical/contact data is not written to logs.
 */
export const httpLogger: RequestHandler = morgan(
  isProduction ? 'combined' : ':method :url :status :response-time ms',
  {
    skip: () => isTest,
  },
);
