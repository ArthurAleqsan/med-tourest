import type {
  ContactRequestDto,
  ContactRequestInput,
  ContactStatusUpdateInput,
  PaginatedData,
} from '@mta/shared';
import { PAGINATION_DEFAULTS } from '@mta/shared';
import { ContactRequest } from '../models/ContactRequest';
import { ApiError } from '../utils/ApiError';
import { toContactDto } from '../utils/mappers';
import { paginated } from '../utils/pagination';

export async function createContactRequest(input: ContactRequestInput): Promise<ContactRequestDto> {
  const doc = await ContactRequest.create({ ...input, status: 'new' });
  return toContactDto(doc.toObject());
}

export async function listContactRequests(
  page: number = PAGINATION_DEFAULTS.page,
  limit: number = PAGINATION_DEFAULTS.limit,
  status?: string,
): Promise<PaginatedData<ContactRequestDto>> {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const [docs, totalItems] = await Promise.all([
    ContactRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ContactRequest.countDocuments(filter),
  ]);
  return paginated(docs.map(toContactDto), page, limit, totalItems);
}

export async function updateContactStatus(
  id: string,
  input: ContactStatusUpdateInput,
): Promise<ContactRequestDto> {
  const doc = await ContactRequest.findByIdAndUpdate(
    id,
    { status: input.status },
    { new: true },
  ).lean();
  if (!doc) throw ApiError.notFound('Contact request not found.');
  return toContactDto(doc);
}
