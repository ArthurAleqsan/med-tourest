import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { DoctorDto } from '@mta/shared';
import { getDoctor } from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { buildMetadata } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';
import { translateLanguage } from '@/lib/languages';
import { SITE_URL } from '@/lib/config';
import { getTranslations } from '@/i18n/server';
import { loc, locArray } from '@/lib/localized';

export const dynamic = 'force-dynamic';

async function fetchDoctor(
  slug: string,
): Promise<{ doctor: DoctorDto; related: DoctorDto[] } | null> {
  try {
    return await getDoctor(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { m, t, locale } = getTranslations();
  const result = await fetchDoctor(params.slug);
  if (!result)
    return buildMetadata({
      title: m.doctorProfile.notFoundTitle,
      description: '',
      path: `/doctors/${params.slug}`,
    });
  const { doctor } = result;
  const specialtyName = loc(doctor.specialty, 'name', locale);
  const shortDescription = loc(doctor, 'shortDescription', locale);
  return buildMetadata({
    title: t(m.meta.doctorTitle, { name: doctor.fullName, specialty: specialtyName }),
    description: shortDescription,
    path: `/doctors/${doctor.slug}`,
    images: doctor.photoUrl ? [doctor.photoUrl] : undefined,
  });
}

function physicianJsonLd(doctor: DoctorDto, locale: Parameters<typeof loc>[2]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: `Dr. ${doctor.fullName}`,
    medicalSpecialty: loc(doctor.specialty, 'name', locale),
    image: doctor.photoUrl,
    url: `${SITE_URL}/doctors/${doctor.slug}`,
    knowsLanguage: doctor.languages,
    worksFor: doctor.centers.map((center) => ({
      '@type': 'MedicalOrganization',
      name: loc(center, 'name', locale),
      address: loc(center, 'address', locale),
    })),
  };
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-navy-700">
            <span className="mt-1 text-turquoise-500" aria-hidden="true">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function DoctorProfilePage({ params }: { params: { slug: string } }) {
  const { m, t, locale } = getTranslations();
  const result = await fetchDoctor(params.slug);
  if (!result) notFound();
  const { doctor, related } = result;
  const price = formatPrice(doctor.consultationPrice, doctor.consultationCurrency, locale);
  const specialtyName = loc(doctor.specialty, 'name', locale);
  const biography = loc(doctor, 'biography', locale);
  const treatments = locArray(doctor, 'treatments', locale);
  const education = locArray(doctor, 'education', locale);
  const certifications = locArray(doctor, 'certifications', locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd(doctor, locale)) }}
      />

      <div className="border-b border-navy-100 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-10">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-navy-500">
            <Link href="/doctors" className="hover:underline">
              {m.doctorProfile.breadcrumb}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-navy-700">
              {m.common.doctorPrefix} {doctor.fullName}
            </span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-navy-100 shadow-card">
              <img
                src={doctor.photoUrl || 'https://placehold.co/200x200?text=Doctor'}
                alt={t(m.doctorProfile.portraitAlt, { name: doctor.fullName })}
                className="absolute inset-0 h-full w-full object-contain object-center"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-navy-900">
                {m.common.doctorPrefix} {doctor.fullName}
              </h1>
              <p className="mt-1 text-lg font-medium text-brand-700">{specialtyName}</p>
              {doctor.centers[0] && (
                <p className="text-navy-600">
                  {doctor.centers.map((c) => loc(c, 'name', locale)).join(' · ')}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="turquoise">
                  {t(m.doctorProfile.experience, { years: doctor.yearsOfExperience })}
                </Badge>
                {doctor.languages.map((lang) => (
                  <Badge key={lang} tone="navy">
                    {translateLanguage(m, lang)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-navy-900">{m.doctorProfile.about}</h2>
            <p className="mt-3 leading-relaxed text-navy-700">{biography}</p>
          </div>
          <DetailList title={m.doctorProfile.treatments} items={treatments} />
          <DetailList title={m.doctorProfile.education} items={education} />
          <DetailList title={m.doctorProfile.certifications} items={certifications} />

          {doctor.centers.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-navy-900">
                {m.doctorProfile.centersTitle}
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {doctor.centers.map((center) => {
                  const centerName = loc(center, 'name', locale);
                  const centerCity = loc(center, 'city', locale);
                  const centerAddress = loc(center, 'address', locale);
                  return (
                  <li
                    key={center.id}
                    className="rounded-xl border border-navy-100 bg-white p-4 shadow-card"
                  >
                    <Link
                      href={`/centers/${center.slug}`}
                      className="font-semibold text-navy-900 hover:text-brand-700"
                    >
                      {centerName}
                    </Link>
                    {centerCity && <p className="text-sm text-navy-600">{centerCity}</p>}
                    {centerAddress && (
                      <p className="mt-1 text-sm text-navy-500">{centerAddress}</p>
                    )}
                    <Link
                      href={`/centers/${center.slug}`}
                      className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline"
                    >
                      {m.doctorProfile.viewCenter}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <h2 className="text-lg font-semibold text-navy-900">{m.doctorProfile.requestTitle}</h2>
            {price && (
              <p className="mt-2 text-sm text-navy-600">
                {m.doctorProfile.consultationFrom}{' '}
                <span className="font-semibold text-navy-900">{price}</span>
              </p>
            )}
            <LinkButton
              href={`/appointments/request?doctorId=${doctor.id}&doctor=${doctor.slug}`}
              className="mt-5"
              fullWidth
            >
              {m.doctorProfile.requestAppointment}
            </LinkButton>
            <p className="mt-3 text-xs text-navy-500">{m.doctorProfile.requestNote}</p>
          </Card>
        </aside>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-navy-100 bg-navy-50/50 py-12">
          <Container>
            <h2 className="mb-8 text-2xl font-bold text-navy-900">
              {m.doctorProfile.relatedTitle}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
