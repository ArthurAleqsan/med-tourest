import type { Request, Response } from 'express';
import type { ContactRequestInput, ContactStatusUpdateInput } from '@mta/shared';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as service from '../services/contact.service';

export const createContactRequest = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as ContactRequestInput;
  await service.createContactRequest(body);
  sendSuccess(
    res,
    { received: true },
    'Thank you for contacting us. Our team will reach out to you shortly.',
    201,
  );
});

export const listContactRequests = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const result = await service.listContactRequests(page, limit, status);
  sendSuccess(res, result);
});

export const updateContactStatus = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validatedBody as ContactStatusUpdateInput;
  const data = await service.updateContactStatus(req.params.id, body);
  sendSuccess(res, data, 'Contact request updated');
});
