import { Section, SectionHeading } from '@/components/ui/Section';
import { getTranslations } from '@/i18n/server';

export function HowItWorks() {
  const { m } = getTranslations();
  const section = m.home.howItWorks;

  return (
    <Section id="how-it-works" muted>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      />
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {section.steps.map((step, index) => (
          <li key={step.title} className="relative rounded-2xl bg-white p-6 shadow-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
              {index + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-navy-900">{step.title}</h3>
            <p className="mt-2 text-sm text-navy-600/80">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
