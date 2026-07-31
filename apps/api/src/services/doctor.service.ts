import type {
  DoctorDto,
  DoctorInput,
  DoctorListQuery,
  DoctorUpdateInput,
  PaginatedData,
} from '@mta/shared';
import { Doctor } from '../models/Doctor';
import { Specialty } from '../models/Specialty';
import { MedicalCenter } from '../models/MedicalCenter';
import { ApiError } from '../utils/ApiError';
import { ensureUniqueSlug } from '../utils/ensureUniqueSlug';
import { slugify } from '../utils/slugify';
import { toDoctorDto } from '../utils/mappers';
import { paginated } from '../utils/pagination';

const SPECIALTY_POPULATE = 'en_name ru_name am_name slug' as const;
const CENTER_POPULATE = {
  path: 'centers',
  select: 'en_name ru_name am_name slug en_city ru_city am_city en_address ru_address am_address',
} as const;

const SORT_MAP: Record<DoctorListQuery['sort'], Record<string, 1 | -1>> = {
  experience_desc: { yearsOfExperience: -1, lastName: 1 },
  experience_asc: { yearsOfExperience: 1, lastName: 1 },
  name_asc: { lastName: 1, firstName: 1 },
  name_desc: { lastName: -1, firstName: -1 },
};

async function buildFilter(query: DoctorListQuery): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = { isActive: true };

  if (query.specialty) {
    // Accept either a specialty slug or an ObjectId.
    if (/^[a-f\d]{24}$/i.test(query.specialty)) {
      filter.specialty = query.specialty;
    } else {
      const specialty = await Specialty.findOne({ slug: slugify(query.specialty) })
        .select('_id')
        .lean();
      filter.specialty = specialty?._id ?? null;
    }
  }
  if (query.language) {
    filter.languages = { $regex: `^${escapeRegex(query.language)}$`, $options: 'i' };
  }
  if (query.center) {
    // Accept either a center slug or an ObjectId.
    if (/^[a-f\d]{24}$/i.test(query.center)) {
      filter.centers = query.center;
    } else {
      const center = await MedicalCenter.findOne({ slug: slugify(query.center) })
        .select('_id')
        .lean();
      filter.centers = center?._id ?? null;
    }
  }
  if (query.featured !== undefined) {
    filter.isFeatured = query.featured;
  }
  if (query.search) {
    const rx = { $regex: escapeRegex(query.search), $options: 'i' };
    filter.$or = [{ firstName: rx }, { lastName: rx }];
  }
  return filter;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listDoctors(query: DoctorListQuery): Promise<PaginatedData<DoctorDto>> {
  const filter = await buildFilter(query);
  const skip = (query.page - 1) * query.limit;

  const [docs, totalItems] = await Promise.all([
    Doctor.find(filter)
      .populate('specialty', SPECIALTY_POPULATE)
      .populate(CENTER_POPULATE)
      .sort(SORT_MAP[query.sort])
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Doctor.countDocuments(filter),
  ]);

  return paginated(docs.map(toDoctorDto), query.page, query.limit, totalItems);
}

export async function listAllDoctors(
  query: DoctorListQuery,
): Promise<PaginatedData<DoctorDto>> {
  const filter = await buildFilter(query);
  // Admin sees inactive doctors too.
  delete filter.isActive;
  const skip = (query.page - 1) * query.limit;
  const [docs, totalItems] = await Promise.all([
    Doctor.find(filter)
      .populate('specialty', SPECIALTY_POPULATE)
      .populate(CENTER_POPULATE)
      .sort(SORT_MAP[query.sort])
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Doctor.countDocuments(filter),
  ]);
  return paginated(docs.map(toDoctorDto), query.page, query.limit, totalItems);
}

export async function getDoctorById(id: string): Promise<DoctorDto> {
  const doc = await Doctor.findById(id)
    .populate('specialty', SPECIALTY_POPULATE)
    .populate(CENTER_POPULATE)
    .lean();
  if (!doc) throw ApiError.notFound('Doctor not found.');
  return toDoctorDto(doc);
}

export async function listFeaturedDoctors(limit = 6): Promise<DoctorDto[]> {
  const docs = await Doctor.find({ isActive: true, isFeatured: true })
    .populate('specialty', SPECIALTY_POPULATE)
    .populate(CENTER_POPULATE)
    .sort({ yearsOfExperience: -1 })
    .limit(limit)
    .lean();
  return docs.map(toDoctorDto);
}

export async function getDoctorBySlug(slug: string): Promise<DoctorDto> {
  const doc = await Doctor.findOne({ slug, isActive: true })
    .populate('specialty', SPECIALTY_POPULATE)
    .populate(CENTER_POPULATE)
    .lean();
  if (!doc) throw ApiError.notFound('Doctor not found.');
  return toDoctorDto(doc);
}

export async function getRelatedDoctors(slug: string, limit = 3): Promise<DoctorDto[]> {
  const doc = await Doctor.findOne({ slug, isActive: true }).select('_id specialty').lean();
  if (!doc) return [];
  const docs = await Doctor.find({
    isActive: true,
    specialty: doc.specialty,
    _id: { $ne: doc._id },
  })
    .populate('specialty', SPECIALTY_POPULATE)
    .populate(CENTER_POPULATE)
    .sort({ isFeatured: -1, yearsOfExperience: -1 })
    .limit(limit)
    .lean();
  return docs.map(toDoctorDto);
}

async function ensureSpecialtyExists(id: string): Promise<void> {
  const exists = await Specialty.exists({ _id: id });
  if (!exists) throw ApiError.badRequest('Selected specialty does not exist.');
}

async function ensureCentersExist(ids: string[]): Promise<void> {
  const unique = [...new Set(ids)];
  const count = await MedicalCenter.countDocuments({ _id: { $in: unique } });
  if (count !== unique.length) {
    throw ApiError.badRequest('One or more selected medical centers do not exist.');
  }
}

export async function createDoctor(input: DoctorInput): Promise<DoctorDto> {
  await ensureSpecialtyExists(input.specialty);
  await ensureCentersExist(input.centerIds);
  const { centerIds, slug: rawSlug, ...rest } = input;
  const slug = await ensureUniqueSlug(rawSlug, async (candidate) =>
    Boolean(await Doctor.exists({ slug: candidate })),
  );
  const created = await Doctor.create({ ...rest, centers: centerIds, slug });
  const doc = await Doctor.findById(created._id)
    .populate('specialty', SPECIALTY_POPULATE)
    .populate(CENTER_POPULATE)
    .lean();
  return toDoctorDto(doc!);
}

export async function updateDoctor(id: string, input: DoctorUpdateInput): Promise<DoctorDto> {
  const existing = await Doctor.findById(id);
  if (!existing) throw ApiError.notFound('Doctor not found.');
  if (input.specialty) await ensureSpecialtyExists(input.specialty);
  if (input.centerIds) await ensureCentersExist(input.centerIds);

  if (input.slug !== undefined) {
    const next = slugify(input.slug);
    if (!next) throw ApiError.badRequest('Invalid slug.');
    if (next !== existing.slug) {
      const taken = await Doctor.exists({ slug: next, _id: { $ne: id } });
      if (taken) throw ApiError.conflict('This slug is already in use.');
      existing.slug = next;
    }
  }

  const { centerIds, slug: _slug, ...rest } = input;
  Object.assign(existing, rest);
  if (centerIds) existing.set('centers', centerIds);
  await existing.save();
  const doc = await Doctor.findById(id)
    .populate('specialty', SPECIALTY_POPULATE)
    .populate(CENTER_POPULATE)
    .lean();
  return toDoctorDto(doc!);
}

export async function deleteDoctor(id: string): Promise<void> {
  const deleted = await Doctor.findByIdAndDelete(id);
  if (!deleted) throw ApiError.notFound('Doctor not found.');
}
