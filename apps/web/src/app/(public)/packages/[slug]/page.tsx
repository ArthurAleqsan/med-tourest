import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PackageDto } from '@mta/shared';
import { getPackage } from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';
import { getTranslations } from '@/i18n/server';
import { loc, locArray } from '@/lib/localized';

export const dynamic = 'force-dynamic';

async function fetchPackage(slug: string): Promise<PackageDto | null> {
  try {
    return await getPackage(slug);
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
  const pkg = await fetchPackage(params.slug);
  if (!pkg)
    return buildMetadata({
      title: m.packages.notFoundTitle,
      description: '',
      path: `/packages/${params.slug}`,
    });
  const name = loc(pkg, 'name', locale);
  const shortDescription = loc(pkg, 'shortDescription', locale);
  return buildMetadata({
    title: t(m.meta.packageTitle, { name, days: pkg.durationDays }),
    description: shortDescription,
    path: `/packages/${pkg.slug}`,
    images: pkg.photoUrl ? [pkg.photoUrl] : undefined,
  });
}

export default async function PackageDetailPage({ params }: { params: { slug: string } }) {
  const { m, t, locale } = getTranslations();
  const pkg = await fetchPackage(params.slug);
  if (!pkg) notFound();

  const name = loc(pkg, 'name', locale);
  const shortDescription = loc(pkg, 'shortDescription', locale);
  const description = loc(pkg, 'description', locale);
  const hotelName = loc(pkg.hotel, 'name', locale);
  const hotelRoomType = loc(pkg.hotel, 'roomType', locale);
  const hotelDescription = loc(pkg.hotel, 'description', locale);
  const inclusions = locArray(pkg, 'inclusions', locale);

  const price = formatPrice(pkg.priceFrom, pkg.currency, locale);
  const hotelMeta = [
    pkg.hotel.stars ? t(m.packages.hotelStars, { stars: pkg.hotel.stars }) : null,
    hotelRoomType || null,
    pkg.hotel.nights != null
      ? t(m.packages.hotelNights, { nights: pkg.hotel.nights })
      : null,
  ].filter(Boolean);

  return (
    <>
      <div className="border-b border-navy-100 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-10">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-navy-500">
            <Link href="/packages" className="hover:underline">
              {m.packages.breadcrumb}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-navy-700">{name}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {pkg.photoUrl && (
              <div className="relative h-40 w-full max-w-md overflow-hidden rounded-2xl bg-navy-100 shadow-card sm:h-36 sm:w-64 sm:max-w-none">
                <img
                  src={pkg.photoUrl}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-navy-900">{name}</h1>
              <p className="mt-2 text-lg text-navy-700">{shortDescription}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="turquoise">
                  {t(m.packages.durationDays, { days: pkg.durationDays })}
                </Badge>
                {price && <Badge tone="green">{t(m.packages.priceFrom, { price })}</Badge>}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-navy-900">{m.packages.about}</h2>
            <p className="mt-3 leading-relaxed text-navy-700">{description}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy-900">{m.packages.hotelTitle}</h2>
            <Card className="mt-4">
              <h3 className="text-base font-semibold text-navy-900">{hotelName}</h3>
              {hotelMeta.length > 0 && (
                <p className="mt-1 text-sm text-brand-700">{hotelMeta.join(' · ')}</p>
              )}
              {hotelDescription && (
                <p className="mt-3 text-sm leading-relaxed text-navy-700">
                  {hotelDescription}
                </p>
              )}
            </Card>
          </section>

          {pkg.tours.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-navy-900">{m.packages.toursTitle}</h2>
              <ul className="mt-4 space-y-3">
                {pkg.tours.map((tour) => {
                  const tourTitle = loc(tour, 'title', locale);
                  const tourDescription = loc(tour, 'description', locale);
                  return (
                  <li key={tourTitle}>
                    <Card>
                      <h3 className="font-semibold text-navy-900">{tourTitle}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-navy-700">
                        {tourDescription}
                      </p>
                    </Card>
                  </li>
                  );
                })}
              </ul>
            </section>
          )}

          {inclusions.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-navy-900">{m.packages.inclusionsTitle}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-navy-700">
                {inclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <h2 className="text-lg font-semibold text-navy-900">{m.packages.summaryTitle}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-navy-800">{m.packages.durationLabel}</dt>
                <dd className="text-navy-600">
                  {t(m.packages.durationDays, { days: pkg.durationDays })}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-navy-800">{m.packages.hotelSummaryLabel}</dt>
                <dd className="text-navy-600">{hotelName}</dd>
              </div>
              <div>
                <dt className="font-medium text-navy-800">{m.packages.toursSummaryLabel}</dt>
                <dd className="text-navy-600">
                  {pkg.tours.length > 0
                    ? pkg.tours.map((tour) => loc(tour, 'title', locale)).join(', ')
                    : m.packages.noTours}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-navy-800">{m.packages.priceLabel}</dt>
                <dd className="text-navy-600">
                  {price ? t(m.packages.priceFrom, { price }) : m.packages.contactForPrice}
                </dd>
              </div>
            </dl>
            <LinkButton href="/contact" className="mt-5" fullWidth>
              {m.packages.enquire}
            </LinkButton>
            <LinkButton
              href="/appointments/request"
              variant="ghost"
              className="mt-2"
              fullWidth
            >
              {m.packages.requestAppointment}
            </LinkButton>
          </Card>
        </aside>
      </Container>
    </>
  );
}
