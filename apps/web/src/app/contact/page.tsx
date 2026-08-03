import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContactForm } from '@/components/contact/ContactForm';
import { Card } from '@/components/ui/Card';
import { buildMetadata } from '@/lib/seo';
import { CONTACT } from '@/lib/config';
import { getTranslations } from '@/i18n/server';

export function generateMetadata(): Metadata {
  const { m } = getTranslations();
  return buildMetadata({
    title: m.meta.contactTitle,
    description: m.meta.contactDescription,
    path: '/contact',
  });
}

export default function ContactPage() {
  const { m } = getTranslations();
  return (
    <>
      <PageHeader title={m.contactPage.title} description={m.contactPage.description} />
      <section className="py-12">
        <Container className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <ContactForm />

          <aside className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-navy-900">{m.contactPage.reachTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm text-navy-700">
                <li>
                  <span className="font-medium text-navy-800">{m.contactPage.emailLabel}</span>{' '}
                  <a href={`mailto:${CONTACT.email}`} className="text-brand-700 hover:underline">
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <span className="font-medium text-navy-800">{m.contactPage.telegramLabel}</span>{' '}
                  {CONTACT.telegram}
                </li>
                <li>
                  <span className="font-medium text-navy-800">{m.contactPage.whatsappLabel}</span>{' '}
                  {CONTACT.whatsapp}
                </li>
              </ul>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-navy-900">{m.contactPage.officeTitle}</h2>
              <address className="mt-4 not-italic text-sm text-navy-700">
                {CONTACT.officeLine1}
                <br />
                {CONTACT.officeLine2}
              </address>
              <p className="mt-4 text-sm text-navy-600/80">{m.contactPage.supportHours}</p>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <p className="text-sm text-amber-900">{m.contactPage.emergencyNotice}</p>
            </Card>
          </aside>
        </Container>
      </section>
    </>
  );
}
