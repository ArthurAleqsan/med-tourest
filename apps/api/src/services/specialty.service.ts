import type { SpecialtyDto, SpecialtyInput, SpecialtyListQuery, SpecialtyUpdateInput } from '@mta/shared';
import { Specialty } from '../models/Specialty';
import { Doctor } from '../models/Doctor';
import { ApiError } from '../utils/ApiError';
import { ensureUniqueSlug } from '../utils/ensureUniqueSlug';
import { slugify } from '../utils/slugify';
import { toSpecialtyDto } from '../utils/mappers';

/** Returns a map of specialtyId -> count of active doctors. */
async function activeDoctorCounts(): Promise<Map<string, number>> {
  const rows = await Doctor.aggregate<{ _id: unknown; count: number }>([
    { $match: { isActive: true } },
    { $group: { _id: '$specialty', count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((row) => [String(row._id), row.count]));
}

export async function listPublicSpecialties(query: SpecialtyListQuery): Promise<SpecialtyDto[]> {
  const filter: Record<string, unknown> = { isActive: true };
  if (query.search) {
    const rx = { $regex: query.search, $options: 'i' };
    filter.$or = [{ en_name: rx }, { ru_name: rx }, { am_name: rx }];
  }
  const [docs, counts] = await Promise.all([
    Specialty.find(filter).sort({ displayOrder: 1, en_name: 1 }).lean(),
    activeDoctorCounts(),
  ]);
  return docs.map((doc) => toSpecialtyDto(doc, counts.get(String(doc._id)) ?? 0));
}

export async function getSpecialtyBySlug(slug: string): Promise<SpecialtyDto> {
  const doc = await Specialty.findOne({ slug, isActive: true }).lean();
  if (!doc) throw ApiError.notFound('Specialty not found.');
  const count = await Doctor.countDocuments({ specialty: doc._id, isActive: true });
  return toSpecialtyDto(doc, count);
}

export async function listAllSpecialties(): Promise<SpecialtyDto[]> {
  const [docs, counts] = await Promise.all([
    Specialty.find({}).sort({ displayOrder: 1, en_name: 1 }).lean(),
    activeDoctorCounts(),
  ]);
  return docs.map((doc) => toSpecialtyDto(doc, counts.get(String(doc._id)) ?? 0));
}

export async function getSpecialtyById(id: string): Promise<SpecialtyDto> {
  const doc = await Specialty.findById(id).lean();
  if (!doc) throw ApiError.notFound('Specialty not found.');
  const count = await Doctor.countDocuments({ specialty: doc._id, isActive: true });
  return toSpecialtyDto(doc, count);
}

export async function createSpecialty(input: SpecialtyInput): Promise<SpecialtyDto> {
  const slug = await ensureUniqueSlug(input.slug, async (candidate) =>
    Boolean(await Specialty.exists({ slug: candidate })),
  );
  const doc = await Specialty.create({ ...input, slug });
  return toSpecialtyDto(doc.toObject());
}

export async function updateSpecialty(
  id: string,
  input: SpecialtyUpdateInput,
): Promise<SpecialtyDto> {
  const existing = await Specialty.findById(id);
  if (!existing) throw ApiError.notFound('Specialty not found.');
  if (input.slug !== undefined) {
    const next = slugify(input.slug);
    if (!next) throw ApiError.badRequest('Invalid slug.');
    if (next !== existing.slug) {
      const taken = await Specialty.exists({ slug: next, _id: { $ne: id } });
      if (taken) throw ApiError.conflict('This slug is already in use.');
      existing.slug = next;
    }
  }
  const { slug: _slug, ...rest } = input;
  Object.assign(existing, rest);
  await existing.save();
  return toSpecialtyDto(existing.toObject());
}

export async function deleteSpecialty(id: string): Promise<void> {
  const hasDoctors = await Doctor.exists({ specialty: id });
  if (hasDoctors) {
    throw ApiError.conflict('Cannot delete a specialty that still has doctors assigned.');
  }
  const deleted = await Specialty.findByIdAndDelete(id);
  if (!deleted) throw ApiError.notFound('Specialty not found.');
}

export async function resolveSpecialtyIdBySlug(slug: string): Promise<string | null> {
  const doc = await Specialty.findOne({ slug: slugify(slug) }).select('_id').lean();
  return doc ? String(doc._id) : null;
}
