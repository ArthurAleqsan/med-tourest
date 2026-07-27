import { Section, SectionHeading } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { getTranslations } from '@/i18n/server';

export function WhyArmenia() {
  const { m } = getTranslations();
  const section = m.home.whyArmenia;

  return (
    <Section id="why-armenia">
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {section.benefits.map((benefit) => (
          <Card key={benefit.title} className="border-l-4 border-l-turquoise-400">
            <h3 className="text-lg font-semibold text-navy-900">{benefit.title}</h3>
            <p className="mt-2 text-sm text-navy-600/80">{benefit.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
