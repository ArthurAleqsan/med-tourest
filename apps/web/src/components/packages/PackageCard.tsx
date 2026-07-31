import Link from 'next/link';
import type { PackageDto } from '@mta/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { getTranslations } from '@/i18n/server';
import { loc } from '@/lib/localized';

export function PackageCard({ pkg }: { pkg: PackageDto }) {
  const { m, t, locale, plural } = getTranslations();
  const price = formatPrice(pkg.priceFrom, pkg.currency, locale);
  const name = loc(pkg, 'name', locale);
  const shortDescription = loc(pkg, 'shortDescription', locale);
  const hotelName = loc(pkg.hotel, 'name', locale);

  return (
    <Card hover className="flex flex-col">
      <Link href={`/packages/${pkg.slug}`} className="group flex flex-1 flex-col">
        {pkg.photoUrl && (
          <img
            src={pkg.photoUrl}
            alt={name}
            width={640}
            height={360}
            className="mb-4 h-40 w-full rounded-xl object-cover"
            loading="lazy"
          />
        )}
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge tone="turquoise">{t(m.packages.durationDays, { days: pkg.durationDays })}</Badge>
          {pkg.tours.length > 0 && (
            <Badge tone="gray">{plural(pkg.tours.length, m.packages.tourCount)}</Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold text-navy-900 group-hover:text-brand-700">
          {name}
        </h3>
        <p className="mt-0.5 text-sm font-medium text-brand-700">
          {t(m.packages.hotelLabel, { name: hotelName })}
        </p>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-navy-700">{shortDescription}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-navy-800">
            {price ? t(m.packages.priceFrom, { price }) : m.packages.contactForPrice}
          </span>
          <span className="text-sm font-medium text-brand-700">{m.packages.viewPackage}</span>
        </div>
      </Link>
    </Card>
  );
}
