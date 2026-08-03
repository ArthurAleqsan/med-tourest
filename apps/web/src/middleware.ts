import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Public detail URLs stay pretty (`/centers/my-slug`), but the App Router page
 * lives at `/centers/detail` (no `[slug]` folder).
 *
 * Why: some production proxies return HTTP 400 for `/_next/static/.../%5Bslug%5D/...`
 * chunk URLs, which crashes client hydration on every hard reload of detail pages.
 */
const SECTIONS = ['centers', 'doctors', 'packages', 'specialties'] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const section of SECTIONS) {
    const prefix = `/${section}/`;
    if (!pathname.startsWith(prefix)) continue;

    const slug = pathname.slice(prefix.length);
    // Single segment only; skip the internal detail route itself.
    if (!slug || slug.includes('/') || slug === 'detail') continue;

    const url = request.nextUrl.clone();
    url.pathname = `/${section}/detail`;
    url.searchParams.set('slug', decodeURIComponent(slug));
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/centers/:slug',
    '/doctors/:slug',
    '/packages/:slug',
    '/specialties/:slug',
  ],
};
