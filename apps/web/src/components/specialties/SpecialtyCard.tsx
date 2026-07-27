import Link from 'next/link';
import type { SpecialtyDto } from '@mta/shared';
import { Card } from '@/components/ui/Card';
import { SpecialtyIcon } from '@/components/ui/SpecialtyIcon';
import { getTranslations } from '@/i18n/server';

export function SpecialtyCard({ specialty }: { specialty: SpecialtyDto }) {
  const { m, plural } = getTranslations();
  const count = specialty.doctorCount ?? 0;

  return (
    <Link
      href={`/doctors?specialty=${specialty.slug}`}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      <Card hover className="h-full">
        <SpecialtyIcon icon={specialty.icon} />
        <h3 className="mt-4 text-lg font-semibold text-navy-900 group-hover:text-brand-700">
          {specialty.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-navy-600/80">{specialty.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-navy-500">
            {plural(count, m.specialtyCard.doctorCount)}
          </span>
          <span className="text-sm font-semibold text-brand-700 group-hover:translate-x-0.5 transition-transform">
            {m.specialtyCard.viewDoctors}
          </span>
        </div>
      </Card>
    </Link>
  );
}
