import { Section, SectionHeading } from '@/components/ui/Section';
import { getTranslations } from '@/i18n/server';

export function Faq() {
  const { m } = getTranslations();
  const section = m.home.faq;

  return (
    <Section id="faq" muted>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      />
      <div className="mx-auto max-w-3xl divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
        {section.items.map((faq) => (
          <details key={faq.q} className="group px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-navy-900">
              {faq.q}
              <span
                className="text-brand-600 transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-navy-600/90">{faq.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
