import { Section, SectionHeading } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { getTranslations } from '@/i18n/server';

export function Services() {
  const { m } = getTranslations();
  const section = m.home.services;

  return (
    <Section muted>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((service) => (
          <Card key={service.title} hover>
            <h3 className="text-base font-semibold text-navy-900">{service.title}</h3>
            <p className="mt-2 text-sm text-navy-600/80">{service.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
