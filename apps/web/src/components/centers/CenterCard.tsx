import Link from 'next/link';
import type { MedicalCenterDto } from '@mta/shared';
import { Card } from '@/components/ui/Card';
import { getTranslations } from '@/i18n/server';
import { loc } from '@/lib/localized';

export function CenterCard({ center }: { center: MedicalCenterDto }) {
  const { m, plural, locale } = getTranslations();
  const count = center.doctorCount ?? 0;
  const name = loc(center, 'name', locale);
  const city = loc(center, 'city', locale);
  const shortDescription = loc(center, 'shortDescription', locale);

  return (
    <Card hover className="flex flex-col overflow-hidden p-0">
      <Link href={`/centers/${center.slug}`} className="group flex flex-1 flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-100">
          {center.photoUrl ? (
            <img
              src={center.photoUrl}
              alt={name}
              className="absolute inset-0 h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-navy-100" aria-hidden />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold text-navy-900 group-hover:text-brand-700">
            {name}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-brand-700">{city}</p>
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-navy-700">{shortDescription}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-navy-500">{plural(count, m.centers.doctorCount)}</span>
            <span className="text-sm font-medium text-brand-700">{m.centers.viewCenter}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
