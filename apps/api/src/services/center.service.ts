import type {
  CenterListQuery,
  MedicalCenterDto,
  MedicalCenterInput,
  MedicalCenterUpdateInput,
} from '@mta/shared';
import { MedicalCenter } from '../models/MedicalCenter';
import { Doctor } from '../models/Doctor';
import { ApiError } from '../utils/ApiError';
import { ensureUniqueSlug } from '../utils/ensureUniqueSlug';
import { slugify } from '../utils/slugify';
import { toMedicalCenterDto } from '../utils/mappers';

/** Returns a map of centerId -> count of active doctors practising there. */
async function activeDoctorCounts(): Promise<Map<string, number>> {
  const rows = await Doctor.aggregate<{ _id: unknown; count: number }>([
    { $match: { isActive: true } },
    { $unwind: '$centers' },
    { $group: { _id: '$centers', count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((row) => [String(row._id), row.count]));
}

export async function listPublicCenters(query: CenterListQuery): Promise<MedicalCenterDto[]> {
  const filter: Record<string, unknown> = { isActive: true };
  if (query.search) {
    const rx = { $regex: query.search, $options: 'i' };
    filter.$or = [
      { en_name: rx },
      { ru_name: rx },
      { am_name: rx },
      { en_city: rx },
      { ru_city: rx },
      { am_city: rx },
    ];
  }
  const [docs, counts] = await Promise.all([
    MedicalCenter.find(filter).sort({ displayOrder: 1, en_name: 1 }).lean(),
    activeDoctorCounts(),
  ]);
  return docs.map((doc) => toMedicalCenterDto(doc, counts.get(String(doc._id)) ?? 0));
}

export async function getCenterBySlug(slug: string): Promise<MedicalCenterDto> {
  const doc = await MedicalCenter.findOne({ slug, isActive: true }).lean();
  if (!doc) throw ApiError.notFound('Medical center not found.');
  const count = await Doctor.countDocuments({ centers: doc._id, isActive: true });
  return toMedicalCenterDto(doc, count);
}

export async function listAllCenters(): Promise<MedicalCenterDto[]> {
  const [docs, counts] = await Promise.all([
    MedicalCenter.find({}).sort({ displayOrder: 1, en_name: 1 }).lean(),
    activeDoctorCounts(),
  ]);
  return docs.map((doc) => toMedicalCenterDto(doc, counts.get(String(doc._id)) ?? 0));
}

export async function getCenterById(id: string): Promise<MedicalCenterDto> {
  const doc = await MedicalCenter.findById(id).lean();
  if (!doc) throw ApiError.notFound('Medical center not found.');
  const count = await Doctor.countDocuments({ centers: doc._id, isActive: true });
  return toMedicalCenterDto(doc, count);
}

export async function createCenter(input: MedicalCenterInput): Promise<MedicalCenterDto> {
  const slug = await ensureUniqueSlug(input.slug || input.en_name, async (candidate) =>
    Boolean(await MedicalCenter.exists({ slug: candidate })),
  );
  const doc = await MedicalCenter.create({ ...input, slug });
  return toMedicalCenterDto(doc.toObject());
}

export async function updateCenter(
  id: string,
  input: MedicalCenterUpdateInput,
): Promise<MedicalCenterDto> {
  const existing = await MedicalCenter.findById(id);
  if (!existing) throw ApiError.notFound('Medical center not found.');
  if (input.slug !== undefined) {
    const next = slugify(input.slug);
    if (!next) throw ApiError.badRequest('Invalid slug.');
    if (next !== existing.slug) {
      const taken = await MedicalCenter.exists({ slug: next, _id: { $ne: id } });
      if (taken) throw ApiError.conflict('This slug is already in use.');
      existing.slug = next;
    }
  }
  const { slug: _slug, ...rest } = input;
  Object.assign(existing, rest);
  await existing.save();
  return toMedicalCenterDto(existing.toObject());
}

export async function deleteCenter(id: string): Promise<void> {
  const hasDoctors = await Doctor.exists({ centers: id });
  if (hasDoctors) {
    throw ApiError.conflict('Cannot delete a medical center that still has doctors assigned.');
  }
  const deleted = await MedicalCenter.findByIdAndDelete(id);
  if (!deleted) throw ApiError.notFound('Medical center not found.');
}

export async function resolveCenterIdBySlug(slug: string): Promise<string | null> {
  const doc = await MedicalCenter.findOne({ slug: slugify(slug) }).select('_id').lean();
  return doc ? String(doc._id) : null;
}
