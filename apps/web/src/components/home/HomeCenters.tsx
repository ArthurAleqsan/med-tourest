import type { MedicalCenterDto } from '@mta/shared';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import { CenterCard } from '@/components/centers/CenterCard';
import { EmptyState } from '@/components/ui/feedback';
import { getTranslations } from '@/i18n/server';

/** Compact home intro + medical centers (replaces the large hero). */
export function HomeCenters({ centers }: { centers: MedicalCenterDto[] }) {
  const { m } = getTranslations();
  const intro = m.home.intro;
  const section = m.home.centers;

  return (
    <section className="border-b border-navy-100 bg-gradient-to-b from-brand-50/50 to-white">
      <Container className="py-8 sm:py-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-turquoise-600">
            {intro.eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {intro.title}
          </h1>
          <p className="mt-3 text-base text-navy-600/90 sm:text-lg">{intro.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <LinkButton href="/appointments/request" size="sm">
              {intro.requestAppointment}
            </LinkButton>
            <LinkButton href="/doctors" size="sm" variant="outline">
              {intro.findDoctor}
            </LinkButton>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-turquoise-600">
                {section.eyebrow}
              </p>
              <h2 className="mt-1 text-xl font-bold text-navy-900 sm:text-2xl">{section.title}</h2>
              <p className="mt-1 max-w-xl text-sm text-navy-600/80">{section.description}</p>
            </div>
            <LinkButton href="/centers" variant="ghost" size="sm" className="self-start sm:self-auto">
              {section.viewAll}
            </LinkButton>
          </div>

          {centers.length === 0 ? (
            <EmptyState title={section.emptyTitle} description={section.emptyDescription} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {centers.map((center) => (
                <CenterCard key={center.id} center={center} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
