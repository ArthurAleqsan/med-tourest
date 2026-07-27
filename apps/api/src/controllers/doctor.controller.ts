import type { Request, Response } from 'express';
import type { DoctorInput, DoctorListQuery, DoctorUpdateInput } from '@mta/shared';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as service from '../services/doctor.service';

export const listDoctors = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as DoctorListQuery;
  const result = await service.listDoctors(query);
  sendSuccess(res, result);
});

export const listFeaturedDoctors = asyncHandler(async (_req: Request, res: Response) => {
  const data = await service.listFeaturedDoctors();
  sendSuccess(res, data);
});

export const adminListDoctors = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as DoctorListQuery;
  const result = await service.listAllDoctors(query);
  sendSuccess(res, result);
});

export const adminGetDoctor = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getDoctorById(req.params.id);
  sendSuccess(res, data);
});

export const getDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await service.getDoctorBySlug(req.params.slug);
  const related = await service.getRelatedDoctors(req.params.slug);
  sendSuccess(res, { doctor, related });
});

export const createDoctor = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as DoctorInput;
  const data = await service.createDoctor(body);
  sendSuccess(res, data, 'Doctor created successfully', 201);
});

export const updateDoctor = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as DoctorUpdateInput;
  const data = await service.updateDoctor(req.params.id, body);
  sendSuccess(res, data, 'Doctor updated successfully');
});

export const deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteDoctor(req.params.id);
  sendSuccess(res, { deleted: true }, 'Doctor deleted successfully');
});
