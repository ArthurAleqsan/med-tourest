import type { Request, Response } from 'express';
import type { AdminLoginInput } from '@mta/shared';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';
import * as authService from '../services/auth.service';
import { getDashboardSummary } from '../services/dashboard.service';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as AdminLoginInput;
  const result = await authService.loginAdmin(body);
  sendSuccess(res, result, 'Logged in successfully');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) throw ApiError.unauthorized();
  const user = await authService.getAdminById(req.admin.sub);
  sendSuccess(res, user);
});

export const dashboard = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await getDashboardSummary();
  sendSuccess(res, summary);
});
