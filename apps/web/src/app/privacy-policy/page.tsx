import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { buildMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';

export function generateMetadata(): Metadata {
  const { m } = getTranslations();
  return buildMetadata({
    title: m.meta.privacyTitle,
    description: m.meta.privacyDescription,
    path: '/privacy-policy',
  });
}

export default function PrivacyPolicyPage() {
  const { m } = getTranslations();
  return (
    <>
      <PageHeader title={m.privacy.title} />
      <section className="py-12">
        <Container className="max-w-3xl">
          <div className="prose-basic">
            <p>{m.privacy.intro}</p>
            <h2>{m.privacy.collectTitle}</h2>
            <p>{m.privacy.collectBody}</p>
            <h2>{m.privacy.useTitle}</h2>
            <p>{m.privacy.useBody}</p>
            <h2>{m.privacy.retentionTitle}</h2>
            <p>{m.privacy.retentionBody}</p>
            <h2>{m.privacy.contactTitle}</h2>
            <p>{m.privacy.contactBody}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
