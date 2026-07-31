import { ApiError } from './ApiError';
import { slugify } from './slugify';

/** Normalize and ensure a provided slug is unique (or throw conflict). */
export async function ensureUniqueSlug(
  rawSlug: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const slug = slugify(rawSlug);
  if (!slug) {
    throw ApiError.badRequest('Invalid slug.');
  }
  if (await exists(slug)) {
    throw ApiError.conflict('This slug is already in use.');
  }
  return slug;
}
