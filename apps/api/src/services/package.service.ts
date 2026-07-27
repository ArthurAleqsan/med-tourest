import type {
  PackageDto,
  PackageInput,
  PackageListQuery,
  PackageUpdateInput,
} from '@mta/shared';
import { Package } from '../models/Package';
import { ApiError } from '../utils/ApiError';
import { uniqueSlug } from '../utils/slugify';
import { toPackageDto } from '../utils/mappers';

export async function listPublicPackages(query: PackageListQuery): Promise<PackageDto[]> {
  const filter: Record<string, unknown> = { isActive: true };
  if (query.search) {
    const rx = { $regex: query.search, $options: 'i' };
    filter.$or = [{ name: rx }, { shortDescription: rx }];
  }
  const docs = await Package.find(filter).sort({ displayOrder: 1, durationDays: 1, name: 1 }).lean();
  return docs.map((doc) => toPackageDto(doc));
}

export async function getPackageBySlug(slug: string): Promise<PackageDto> {
  const doc = await Package.findOne({ slug, isActive: true }).lean();
  if (!doc) throw ApiError.notFound('Package not found.');
  return toPackageDto(doc);
}

export async function listAllPackages(): Promise<PackageDto[]> {
  const docs = await Package.find({}).sort({ displayOrder: 1, durationDays: 1, name: 1 }).lean();
  return docs.map((doc) => toPackageDto(doc));
}

export async function getPackageById(id: string): Promise<PackageDto> {
  const doc = await Package.findById(id).lean();
  if (!doc) throw ApiError.notFound('Package not found.');
  return toPackageDto(doc);
}

export async function createPackage(input: PackageInput): Promise<PackageDto> {
  const slug = await uniqueSlug(input.name, async (candidate) =>
    Boolean(await Package.exists({ slug: candidate })),
  );
  const doc = await Package.create({ ...input, slug });
  return toPackageDto(doc.toObject());
}

export async function updatePackage(id: string, input: PackageUpdateInput): Promise<PackageDto> {
  const existing = await Package.findById(id);
  if (!existing) throw ApiError.notFound('Package not found.');
  if (input.name && input.name !== existing.name) {
    existing.slug = await uniqueSlug(input.name, async (candidate) =>
      Boolean(await Package.exists({ slug: candidate, _id: { $ne: id } })),
    );
  }
  Object.assign(existing, input);
  await existing.save();
  return toPackageDto(existing.toObject());
}

export async function deletePackage(id: string): Promise<void> {
  const deleted = await Package.findByIdAndDelete(id);
  if (!deleted) throw ApiError.notFound('Package not found.');
}
