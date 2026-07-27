import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { DoctorsBrowser } from '@/components/doctors/DoctorsBrowser';
import { buildMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';

export function generateMetadata(): Metadata {
  const { m } = getTranslations();
  return buildMetadata({
    title: m.meta.doctorsTitle,
    description: m.meta.doctorsDescription,
    path: '/doctors',
  });
}

export default function DoctorsPage() {
  const { m } = getTranslations();
  return (
    <>
      <PageHeader title={m.doctors.pageTitle} description={m.doctors.pageDescription} />
      <section className="py-12">
        <Container>
          <Suspense
            fallback={<div className="py-12 text-center text-navy-500">{m.common.loading}</div>}
          >
            <DoctorsBrowser />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
