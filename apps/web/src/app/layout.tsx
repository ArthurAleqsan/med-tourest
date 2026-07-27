import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { organizationJsonLd } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/config';
import { getTranslations } from '@/i18n/server';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export function generateMetadata(): Metadata {
  const { m } = getTranslations();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${m.home.hero.title}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: m.meta.homeDescription,
    keywords: [
      'medical tourism Armenia',
      'doctors in Armenia',
      'medical travel',
      'treatment Armenia',
      'med.tourest',
      'tourest',
    ],
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/images/logo-mark.svg' }],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, m } = getTranslations();
  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <Providers locale={locale} messages={m}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
