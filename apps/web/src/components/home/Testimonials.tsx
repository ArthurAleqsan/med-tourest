import { Section, SectionHeading } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { getTranslations } from '@/i18n/server';

export function Testimonials() {
  const { m } = getTranslations();
  const section = m.home.testimonials;

  return (
    <Section>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {section.items.map((item) => (
          <Card key={item.name} className="flex flex-col">
            <div aria-hidden="true" className="text-3xl text-turquoise-400">
              “
            </div>
            <blockquote className="flex-1 text-navy-700">{item.quote}</blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-semibold text-navy-900">{item.name}</span>
              <span className="text-navy-500"> · {item.country}</span>
            </figcaption>
          </Card>
        ))}
      </div>
    </Section>
  );
}
