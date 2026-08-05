import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * In production, some stacks return HTTP 400 for chunk URLs containing
 * `%5Bslug%5D` / `/[slug]/`. Those folders are mirrored to `_slug_` by
 * `postbuild` — rewrite requests there.
 *
 * Also maps legacy `(public)/...` chunk paths (pre route-group removal) to
 * the flattened `app/...` layout.
 *
 * Skip in development: Next serves literal `[slug]` chunks and `_slug_`
 * mirrors do not exist until a production build.
 */
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  let nextPath = pathname;

  // Legacy route-group chunk paths from older deploys / cached clients.
  nextPath = nextPath.replace('/app/(public)/', '/app/');
  nextPath = nextPath.replace('/app/%28public%29/', '/app/');

  nextPath = nextPath
    .replaceAll('%5Bslug%5D', '_slug_')
    .replaceAll('/[slug]/', '/_slug_/');

  if (nextPath === pathname) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = nextPath;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/_next/static/chunks/app/:path*'],
};
