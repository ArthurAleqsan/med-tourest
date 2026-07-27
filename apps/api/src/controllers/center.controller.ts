import type { Request, Response } from 'express';
import type {
  CenterListQuery,
  MedicalCenterInput,
  MedicalCenterUpdateInput,
} from '@mta/shared';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as service from '../services/center.service';

export const listCenters = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as CenterListQuery;
  const data = await service.listPublicCenters(query);
  sendSuccess(res, data);
});

export const getCenter = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getCenterBySlug(req.params.slug);
  sendSuccess(res, data);
});

export const adminListCenters = asyncHandler(async (_req: Request, res: Response) => {
  const data = await service.listAllCenters();
  sendSuccess(res, data);
});

export const adminGetCenter = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getCenterById(req.params.id);
  sendSuccess(res, data);
});

export const createCenter = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as MedicalCenterInput;
  const data = await service.createCenter(body);
  sendSuccess(res, data, 'Medical center created successfully', 201);
});

export const updateCenter = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as MedicalCenterUpdateInput;
  const data = await service.updateCenter(req.params.id, body);
  sendSuccess(res, data, 'Medical center updated successfully');
});

export const deleteCenter = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteCenter(req.params.id);
  sendSuccess(res, { deleted: true }, 'Medical center deleted successfully');
});
