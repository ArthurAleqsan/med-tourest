import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { DoctorDto, MedicalCenterDto } from '@mta/shared';
import { getCenter, getDoctors } from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { EmptyState } from '@/components/ui/feedback';
import { buildMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';
import { loc } from '@/lib/localized';

export const dynamic = 'force-dynamic';

async function fetchCenter(slug: string): Promise<MedicalCenterDto | null> {
  try {
    return await getCenter(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}

async function fetchCenterDoctors(slug: string): Promise<DoctorDto[]> {
  try {
    const result = await getDoctors({ center: slug, limit: 100 });
    return result.data;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { m, t, locale } = getTranslations();
  const center = await fetchCenter(params.slug);
  if (!center)
    return buildMetadata({
      title: m.centers.notFoundTitle,
      description: '',
      path: `/centers/${params.slug}`,
    });
  const name = loc(center, 'name', locale);
  const city = loc(center, 'city', locale);
  const shortDescription = loc(center, 'shortDescription', locale);
  return buildMetadata({
    title: t(m.meta.centerTitle, { name, city }),
    description: shortDescription,
    path: `/centers/${center.slug}`,
    images: center.photoUrl ? [center.photoUrl] : undefined,
  });
}

export default async function CenterDetailPage({ params }: { params: { slug: string } }) {
  const { m, t, plural, locale } = getTranslations();
  const center = await fetchCenter(params.slug);
  if (!center) notFound();
  const doctors = await fetchCenterDoctors(params.slug);

  const name = loc(center, 'name', locale);
  const city = loc(center, 'city', locale);
  const description = loc(center, 'description', locale);
  const address = loc(center, 'address', locale);

  return (
    <>
      <div className="border-b border-navy-100 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-10">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-navy-500">
            <Link href="/centers" className="hover:underline">
              {m.centers.breadcrumb}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-navy-700">{name}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {center.photoUrl && (
              <img
                src={center.photoUrl}
                alt={name}
                width={220}
                height={132}
                className="h-32 w-full max-w-xs rounded-2xl object-cover shadow-card sm:w-56"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-navy-900">{name}</h1>
              <p className="mt-1 text-lg font-medium text-brand-700">{city}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="turquoise">
                  {plural(center.doctorCount ?? 0, m.centers.doctorCount)}
                </Badge>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-navy-900">{m.centers.about}</h2>
            <p className="mt-3 leading-relaxed text-navy-700">{description}</p>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-bold text-navy-900">
              {t(m.centers.doctorsAt, { name })}
            </h2>
            {doctors.length === 0 ? (
              <EmptyState
                title={m.centers.noDoctorsTitle}
                description={m.centers.noDoctorsDescription}
                action={<LinkButton href="/contact">{m.centers.contactUs}</LinkButton>}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <h2 className="text-lg font-semibold text-navy-900">{m.centers.contactTitle}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-navy-800">{m.centers.addressLabel}</dt>
                <dd className="text-navy-600">{address}</dd>
              </div>
              {center.phone && (
                <div>
                  <dt className="font-medium text-navy-800">{m.centers.phoneLabel}</dt>
                  <dd className="text-navy-600">
                    <a href={`tel:${center.phone}`} className="hover:underline">
                      {center.phone}
                    </a>
                  </dd>
                </div>
              )}
              {center.email && (
                <div>
                  <dt className="font-medium text-navy-800">{m.centers.emailLabel}</dt>
                  <dd className="text-navy-600">
                    <a href={`mailto:${center.email}`} className="hover:underline">
                      {center.email}
                    </a>
                  </dd>
                </div>
              )}
              {center.website && (
                <div>
                  <dt className="font-medium text-navy-800">{m.centers.websiteLabel}</dt>
                  <dd>
                    <a
                      href={center.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:underline"
                    >
                      {m.centers.visitWebsite}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <LinkButton href="/appointments/request" className="mt-5" fullWidth>
              {m.centers.requestAppointment}
            </LinkButton>
          </Card>
        </aside>
      </Container>
    </>
  );
}
