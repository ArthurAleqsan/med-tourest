import type { Metadata } from 'next';
import type { PackageDto } from '@mta/shared';
import { getPackages } from '@/lib/api/endpoints';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PackageCard } from '@/components/packages/PackageCard';
import { EmptyState } from '@/components/ui/feedback';
import { buildMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  const { m } = getTranslations();
  return buildMetadata({
    title: m.meta.packagesTitle,
    description: m.meta.packagesDescription,
    path: '/packages',
  });
}

async function fetchPackages(): Promise<PackageDto[]> {
  try {
    return await getPackages();
  } catch {
    return [];
  }
}

export default async function PackagesPage() {
  const { m } = getTranslations();
  const packages = await fetchPackages();

  return (
    <>
      <PageHeader title={m.packages.pageTitle} description={m.packages.pageDescription} />
      <section className="py-12">
        <Container>
          {packages.length === 0 ? (
            <EmptyState title={m.packages.emptyTitle} description={m.packages.emptyDescription} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
