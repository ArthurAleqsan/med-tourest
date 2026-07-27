import type { SpecialtyDto } from '@mta/shared';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SpecialtyCard } from '@/components/specialties/SpecialtyCard';
import { EmptyState } from '@/components/ui/feedback';
import { getTranslations } from '@/i18n/server';

export function SpecialtiesSection({ specialties }: { specialties: SpecialtyDto[] }) {
  const { m } = getTranslations();
  const section = m.home.specialties;

  return (
    <Section id="specialties">
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      />
      {specialties.length === 0 ? (
        <EmptyState title={section.emptyTitle} description={section.emptyDescription} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {specialties.map((specialty) => (
            <SpecialtyCard key={specialty.id} specialty={specialty} />
          ))}
        </div>
      )}
    </Section>
  );
}
