import type { Request, Response } from 'express';
import type { HealthStatus } from '@mta/shared';
import { isDatabaseConnected } from '../config/db';
import { sendSuccess } from '../utils/apiResponse';

export function getHealth(_req: Request, res: Response): void {
  const dbConnected = isDatabaseConnected();
  const payload: HealthStatus = {
    status: dbConnected ? 'ok' : 'degraded',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
  };
  sendSuccess(res, payload);
}
