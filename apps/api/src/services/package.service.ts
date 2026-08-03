import type {
  PackageDto,
  PackageInput,
  PackageListQuery,
  PackageUpdateInput,
} from '@mta/shared';
import { Package } from '../models/Package';
import { ApiError } from '../utils/ApiError';
import { ensureUniqueSlug, resolveSlugSource } from '../utils/ensureUniqueSlug';
import { slugify } from '../utils/slugify';
import { toPackageDto } from '../utils/mappers';

export async function listPublicPackages(query: PackageListQuery): Promise<PackageDto[]> {
  const filter: Record<string, unknown> = { isActive: true };
  if (query.search) {
    const rx = { $regex: query.search, $options: 'i' };
    filter.$or = [
      { en_name: rx },
      { ru_name: rx },
      { am_name: rx },
      { en_shortDescription: rx },
      { ru_shortDescription: rx },
      { am_shortDescription: rx },
    ];
  }
  const docs = await Package.find(filter)
    .sort({ displayOrder: 1, durationDays: 1, en_name: 1 })
    .lean();
  return docs.map((doc) => toPackageDto(doc));
}

export async function getPackageBySlug(slug: string): Promise<PackageDto> {
  const doc = await Package.findOne({ slug, isActive: true }).lean();
  if (!doc) throw ApiError.notFound('Package not found.');
  return toPackageDto(doc);
}

export async function listAllPackages(): Promise<PackageDto[]> {
  const docs = await Package.find({})
    .sort({ displayOrder: 1, durationDays: 1, en_name: 1 })
    .lean();
  return docs.map((doc) => toPackageDto(doc));
}

export async function getPackageById(id: string): Promise<PackageDto> {
  const doc = await Package.findById(id).lean();
  if (!doc) throw ApiError.notFound('Package not found.');
  return toPackageDto(doc);
}

export async function createPackage(input: PackageInput): Promise<PackageDto> {
  const slug = await ensureUniqueSlug(resolveSlugSource(input), async (candidate) =>
    Boolean(await Package.exists({ slug: candidate })),
  );
  const doc = await Package.create({ ...input, slug });
  return toPackageDto(doc.toObject());
}

export async function updatePackage(id: string, input: PackageUpdateInput): Promise<PackageDto> {
  const existing = await Package.findById(id);
  if (!existing) throw ApiError.notFound('Package not found.');
  if (input.slug !== undefined) {
    const next = slugify(input.slug);
    if (!next) throw ApiError.badRequest('Invalid slug.');
    if (next !== existing.slug) {
      const taken = await Package.exists({ slug: next, _id: { $ne: id } });
      if (taken) throw ApiError.conflict('This slug is already in use.');
      existing.slug = next;
    }
  }
  const { slug: _slug, ...rest } = input;
  Object.assign(existing, rest);
  await existing.save();
  return toPackageDto(existing.toObject());
}

export async function deletePackage(id: string): Promise<void> {
  const deleted = await Package.findByIdAndDelete(id);
  if (!deleted) throw ApiError.notFound('Package not found.');
}
