import type { Metadata } from 'next';
import type { MedicalCenterDto } from '@mta/shared';
import { getCenters } from '@/lib/api/endpoints';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { CenterCard } from '@/components/centers/CenterCard';
import { EmptyState } from '@/components/ui/feedback';
import { buildMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  const { m } = getTranslations();
  return buildMetadata({
    title: m.meta.centersTitle,
    description: m.meta.centersDescription,
    path: '/centers',
  });
}

async function fetchCenters(): Promise<MedicalCenterDto[]> {
  try {
    return await getCenters();
  } catch {
    return [];
  }
}

export default async function CentersPage() {
  const { m } = getTranslations();
  const centers = await fetchCenters();

  return (
    <>
      <PageHeader title={m.centers.pageTitle} description={m.centers.pageDescription} />
      <section className="py-12">
        <Container>
          {centers.length === 0 ? (
            <EmptyState title={m.centers.emptyTitle} description={m.centers.emptyDescription} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {centers.map((center) => (
                <CenterCard key={center.id} center={center} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
