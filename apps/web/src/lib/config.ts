/**
 * Server components talk to the API directly (internal URL when set).
 * Browser code always uses same-origin `/api/v1`, rewritten by next.config.mjs.
 */
export const API_URL =
  typeof window === 'undefined'
    ? (process.env.API_INTERNAL_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      'http://localhost:5000/api/v1')
    : '/api/v1';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://med.tourest.online';

export const SITE_NAME = 'med.tourest';
export const SITE_TAGLINE = 'Trusted medical care in Armenia, organized around you.';

export const CONTACT = {
  email: 'hello@med.tourest.online',
  telegram: '@medtourest',
  whatsapp: '+374 00 000 000',
  officeLine1: 'Northern Avenue 1',
  officeLine2: 'Yerevan 0001, Armenia',
};
