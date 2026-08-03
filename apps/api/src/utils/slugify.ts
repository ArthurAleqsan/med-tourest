/** Creates a URL-safe slug from arbitrary text. Never throws on bad input. */
export function slugify(input: unknown): string {
  try {
    if (input == null) return '';
    const trimmed = String(input).trim();
    if (!trimmed) return '';

    return trimmed
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  } catch {
    return '';
  }
}

/**
 * Ensures slug uniqueness by appending a numeric suffix when a candidate
 * already exists. `exists` reports whether a given slug is already taken.
 */
export async function uniqueSlug(
  base: unknown,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const root = slugify(base) || 'item';
  let candidate = root;
  let suffix = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await exists(candidate)) {
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
  return candidate;
}
