import type { Request, Response } from 'express';
import type { PackageInput, PackageListQuery, PackageUpdateInput } from '@mta/shared';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as service from '../services/package.service';

export const listPackages = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as PackageListQuery;
  const data = await service.listPublicPackages(query);
  sendSuccess(res, data);
});

export const getPackage = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getPackageBySlug(req.params.slug);
  sendSuccess(res, data);
});

export const adminListPackages = asyncHandler(async (_req: Request, res: Response) => {
  const data = await service.listAllPackages();
  sendSuccess(res, data);
});

export const adminGetPackage = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getPackageById(req.params.id);
  sendSuccess(res, data);
});

export const createPackage = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as PackageInput;
  const data = await service.createPackage(body);
  sendSuccess(res, data, 'Package created successfully', 201);
});

export const updatePackage = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as PackageUpdateInput;
  const data = await service.updatePackage(req.params.id, body);
  sendSuccess(res, data, 'Package updated successfully');
});

export const deletePackage = asyncHandler(async (req: Request, res: Response) => {
  await service.deletePackage(req.params.id);
  sendSuccess(res, { deleted: true }, 'Package deleted successfully');
});
