import type { Request, Response } from 'express';
import type {
  SpecialtyInput,
  SpecialtyListQuery,
  SpecialtyUpdateInput,
} from '@mta/shared';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as service from '../services/specialty.service';

export const listSpecialties = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as SpecialtyListQuery;
  const data = await service.listPublicSpecialties(query);
  sendSuccess(res, data);
});

export const getSpecialty = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getSpecialtyBySlug(req.params.slug);
  sendSuccess(res, data);
});

export const adminListSpecialties = asyncHandler(async (_req: Request, res: Response) => {
  const data = await service.listAllSpecialties();
  sendSuccess(res, data);
});

export const adminGetSpecialty = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getSpecialtyById(req.params.id);
  sendSuccess(res, data);
});

export const createSpecialty = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as SpecialtyInput;
  const data = await service.createSpecialty(body);
  sendSuccess(res, data, 'Specialty created successfully', 201);
});

export const updateSpecialty = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as SpecialtyUpdateInput;
  const data = await service.updateSpecialty(req.params.id, body);
  sendSuccess(res, data, 'Specialty updated successfully');
});

export const deleteSpecialty = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteSpecialty(req.params.id);
  sendSuccess(res, { deleted: true }, 'Specialty deleted successfully');
});
