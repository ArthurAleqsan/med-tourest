import type { Request, Response } from 'express';
import type {
  AppointmentAdminListQuery,
  AppointmentAdminUpdateInput,
  AppointmentRequestInput,
  AppointmentStatusUpdateInput,
} from '@mta/shared';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as service from '../services/appointment.service';

export const createAppointmentRequest = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as AppointmentRequestInput;
  const data = await service.createAppointmentRequest(body);
  sendSuccess(res, data, 'Appointment request submitted successfully', 201);
});

export const getPublicStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getPublicAppointmentStatus(req.params.referenceNumber);
  sendSuccess(res, data);
});

export const listAppointmentRequests = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as AppointmentAdminListQuery;
  const result = await service.listAppointmentRequests(query);
  sendSuccess(res, result);
});

export const getAppointmentRequest = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getAppointmentById(req.params.id);
  sendSuccess(res, data);
});

export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as AppointmentStatusUpdateInput;
  const data = await service.updateAppointmentStatus(req.params.id, body);
  sendSuccess(res, data, 'Appointment status updated');
});

export const updateAppointmentRequest = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as AppointmentAdminUpdateInput;
  const data = await service.updateAppointment(req.params.id, body);
  sendSuccess(res, data, 'Appointment request updated');
});
