import type { DoctorDto } from '@mta/shared';
import { Section, SectionHeading } from '@/components/ui/Section';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { LinkButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/feedback';
import { getTranslations } from '@/i18n/server';

export function FeaturedDoctors({ doctors }: { doctors: DoctorDto[] }) {
  const { m } = getTranslations();
  const section = m.home.featuredDoctors;

  return (
    <Section muted>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      />
      {doctors.length === 0 ? (
        <EmptyState title={section.emptyTitle} description={section.emptyDescription} />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <LinkButton href="/doctors" variant="outline" size="lg">
              {section.browseAll}
            </LinkButton>
          </div>
        </>
      )}
    </Section>
  );
}
