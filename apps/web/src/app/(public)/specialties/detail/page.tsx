import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { DoctorDto, SpecialtyDto } from '@mta/shared';
import { getDoctors, getSpecialty } from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { EmptyState } from '@/components/ui/feedback';
import { SpecialtyIcon } from '@/components/ui/SpecialtyIcon';
import { buildMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';
import { loc, locArray } from '@/lib/localized';

export const dynamic = 'force-dynamic';

async function fetchSpecialty(slug: string): Promise<SpecialtyDto | null> {
  try {
    return await getSpecialty(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { slug?: string };
}): Promise<Metadata> {
  const slug = searchParams.slug ?? '';
  const { m, t, locale } = getTranslations();
  const specialty = slug ? await fetchSpecialty(slug) : null;
  if (!specialty)
    return buildMetadata({
      title: m.specialtyDetail.notFoundTitle,
      description: '',
      path: slug ? `/specialties/${slug}` : '/specialties',
    });
  const name = loc(specialty, 'name', locale);
  const shortDescription = loc(specialty, 'shortDescription', locale);
  return buildMetadata({
    title: t(m.meta.specialtyTitle, { name }),
    description: shortDescription,
    path: `/specialties/${specialty.slug}`,
  });
}

export default async function SpecialtyDetailPage({
  searchParams,
}: {
  searchParams: { slug?: string };
}) {
  const slug = searchParams.slug;
  if (!slug) notFound();

  const { m, t, plural, locale } = getTranslations();
  const specialty = await fetchSpecialty(slug);
  if (!specialty) notFound();

  const name = loc(specialty, 'name', locale);
  const shortDescription = loc(specialty, 'shortDescription', locale);
  const description = loc(specialty, 'description', locale);
  const treatments = locArray(specialty, 'treatments', locale);

  let doctors: DoctorDto[] = [];
  try {
    const result = await getDoctors({ specialty: specialty.slug, limit: 12 });
    doctors = result.data;
  } catch {
    doctors = [];
  }

  return (
    <>
      <div className="border-b border-navy-100 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-12">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-navy-500">
            <Link href="/#specialties" className="hover:underline">
              {m.specialtyDetail.breadcrumb}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-navy-700">{name}</span>
          </nav>
          <div className="flex items-start gap-4">
            <SpecialtyIcon icon={specialty.icon} className="h-14 w-14 text-3xl" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                {name}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-navy-600/80">
                {shortDescription}
              </p>
              <Badge tone="turquoise" className="mt-4">
                {plural(specialty.doctorCount ?? 0, m.specialtyDetail.doctorsAvailable)}
              </Badge>
            </div>
          </div>
        </Container>
      </div>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-navy-900">{m.specialtyDetail.about}</h2>
            <p className="mt-3 leading-relaxed text-navy-700">{description}</p>
          </div>

          {treatments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-navy-900">
                {m.specialtyDetail.availableTreatments}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {treatments.map((treatment) => (
                  <Badge key={treatment} tone="brand" className="text-sm">
                    {treatment}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-navy-900">
              {m.specialtyDetail.interestedTitle}
            </h2>
            <p className="mt-2 text-sm text-navy-600/80">{m.specialtyDetail.interestedBody}</p>
            <LinkButton
              href={`/appointments/request?specialtyId=${specialty.id}`}
              className="mt-5"
              fullWidth
            >
              {m.specialtyDetail.requestAppointment}
            </LinkButton>
          </div>
        </aside>
      </Container>

      <section className="border-t border-navy-100 bg-navy-50/50 py-12">
        <Container>
          <h2 className="mb-8 text-2xl font-bold text-navy-900">
            {t(m.specialtyDetail.doctorsIn, { name })}
          </h2>
          {doctors.length === 0 ? (
            <EmptyState
              title={m.specialtyDetail.emptyTitle}
              description={m.specialtyDetail.emptyDescription}
              action={<LinkButton href="/contact">{m.specialtyDetail.contactUs}</LinkButton>}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
