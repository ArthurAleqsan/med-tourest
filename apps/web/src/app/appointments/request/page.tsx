import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppointmentForm } from '@/components/appointment/AppointmentForm';
import { buildMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';

export function generateMetadata(): Metadata {
  const { m } = getTranslations();
  return buildMetadata({
    title: m.meta.appointmentTitle,
    description: m.meta.appointmentDescription,
    path: '/appointments/request',
  });
}

export default function AppointmentRequestPage() {
  const { m } = getTranslations();
  return (
    <>
      <PageHeader title={m.appointmentPage.title} description={m.appointmentPage.description} />
      <section className="py-12">
        <Container className="max-w-3xl">
          <Suspense
            fallback={
              <div className="py-12 text-center text-navy-500">{m.appointmentPage.loadingForm}</div>
            }
          >
            <AppointmentForm />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
