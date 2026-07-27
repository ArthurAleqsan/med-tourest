import type { Metadata } from 'next';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from './config';

interface PageSeoOptions {
  title: string;
  description: string;
  path?: string;
  images?: string[];
}

/** Builds consistent metadata (canonical, Open Graph, Twitter) for a page. */
export function buildMetadata({ title, description, path = '/', images }: PageSeoOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImages = images ?? [`${SITE_URL}/og-default.png`];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages,
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    areaServed: 'Armenia',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English', 'Armenian', 'Russian', 'French', 'Arabic', 'Persian'],
    },
  };
}
