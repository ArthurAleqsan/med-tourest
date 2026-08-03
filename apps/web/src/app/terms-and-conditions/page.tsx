import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { buildMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';

export function generateMetadata(): Metadata {
  const { m } = getTranslations();
  return buildMetadata({
    title: m.meta.termsTitle,
    description: m.meta.termsDescription,
    path: '/terms-and-conditions',
  });
}

export default function TermsPage() {
  const { m } = getTranslations();
  return (
    <>
      <PageHeader title={m.terms.title} />
      <section className="py-12">
        <Container className="max-w-3xl">
          <div className="prose-basic">
            <p>{m.terms.intro}</p>
            <h2>{m.terms.natureTitle}</h2>
            <p>{m.terms.natureBody}</p>
            <h2>{m.terms.emergencyTitle}</h2>
            <p>{m.terms.emergencyBody}</p>
            <h2>{m.terms.adviceTitle}</h2>
            <p>{m.terms.adviceBody}</p>
            <h2>{m.terms.liabilityTitle}</h2>
            <p>{m.terms.liabilityBody}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
