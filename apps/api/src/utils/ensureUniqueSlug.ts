import { ApiError } from './ApiError';
import { slugify } from './slugify';

/** Normalize and ensure a provided slug is unique (or throw conflict). */
export async function ensureUniqueSlug(
  rawSlug: string | null | undefined,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  if (typeof rawSlug !== 'string' || !rawSlug.trim()) {
    throw ApiError.badRequest('Slug is required.', [
      { field: 'slug', message: 'Slug is required.' },
    ]);
  }

  const slug = slugify(rawSlug);
  if (!slug) {
    throw ApiError.badRequest(
      'Invalid slug. Use lowercase letters, numbers, and hyphens.',
      [{ field: 'slug', message: 'Invalid slug format.' }],
    );
  }
  if (await exists(slug)) {
    throw ApiError.conflict('This slug is already in use.', [
      { field: 'slug', message: 'Already exists.' },
    ]);
  }
  return slug;
}
