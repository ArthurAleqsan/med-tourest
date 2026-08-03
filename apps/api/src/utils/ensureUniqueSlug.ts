import { ApiError } from './ApiError';
import { slugify } from './slugify';

type NamedInput = {
  slug?: string | null;
  en_name?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

/** Pick the best available raw slug source from a create/update payload. */
export function resolveSlugSource(input: NamedInput): string {
  if (typeof input.slug === 'string' && input.slug.trim()) return input.slug.trim();
  if (typeof input.en_name === 'string' && input.en_name.trim()) return input.en_name.trim();
  if (typeof input.name === 'string' && input.name.trim()) return input.name.trim();
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(' ').trim();
  if (fullName) return fullName;
  return '';
}

/** Normalize and ensure a provided slug is unique (or throw conflict). */
export async function ensureUniqueSlug(
  rawSlug: unknown,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const slug = slugify(rawSlug);
  if (!slug) {
    throw ApiError.badRequest('Slug is required.', [
      { field: 'slug', message: 'Provide a URL slug (e.g. astghik-medical-center).' },
    ]);
  }
  if (await exists(slug)) {
    throw ApiError.conflict('This slug is already in use.', [
      { field: 'slug', message: 'Already exists.' },
    ]);
  }
  return slug;
}
