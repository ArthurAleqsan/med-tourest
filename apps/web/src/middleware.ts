import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * In production, some stacks return HTTP 400 for chunk URLs containing
 * `%5Bslug%5D` / `/[slug]/`. Those folders are mirrored to `_slug_` by
 * `postbuild` — rewrite requests there.
 *
 * Skip in development: Next serves literal `[slug]` chunks and `_slug_`
 * mirrors do not exist until a production build.
 */
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  const needsRewrite = pathname.includes('%5Bslug%5D') || pathname.includes('/[slug]/');
  if (!needsRewrite) return NextResponse.next();

  const rewritten = pathname
    .replaceAll('%5Bslug%5D', '_slug_')
    .replaceAll('/[slug]/', '/_slug_/');

  if (rewritten === pathname) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = rewritten;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/_next/static/chunks/app/:path*'],
};
