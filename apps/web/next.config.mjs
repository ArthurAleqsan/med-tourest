/** @type {import('next').NextConfig} */

/**
 * Internal API origin used by Next rewrites (server → Express).
 * Prefer API_INTERNAL_URL in production (e.g. http://127.0.0.1:5050/api/v1).
 */
const apiOrigin =
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api/v1';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mta/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
    ],
  },
  /**
   * Browser calls same-origin `/api/v1/*`; Next proxies to the real API.
   * This avoids baking localhost into client bundles and fixes empty client data
   * when `/api` is not proxied by nginx.
   */
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiOrigin.replace(/\/$/, '')}/:path*`,
      },
    ];
  },
};

export default nextConfig;
