'use client';

import type { DoctorDto } from '@mta/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import { translateLanguage } from '@/lib/languages';

export function DoctorCard({ doctor }: { doctor: DoctorDto }) {
  const { m, t, locale } = useI18n();
  const price = formatPrice(doctor.consultationPrice, doctor.consultationCurrency, locale);
  const centers = doctor.centers ?? [];
  const primaryCenter = centers[0];
  const extraCenters = centers.length - 1;

  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start gap-4">
        <img
          src={doctor.photoUrl || 'https://placehold.co/160x160?text=Doctor'}
          alt={t(m.doctors.card.portraitAlt, { name: doctor.fullName })}
          width={72}
          height={72}
          className="h-18 w-18 shrink-0 rounded-xl object-cover"
          loading="lazy"
        />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-navy-900">
            {m.common.doctorPrefix} {doctor.fullName}
          </h3>
          <p className="text-sm font-medium text-brand-700">{doctor.specialty.name}</p>
          {primaryCenter && (
            <p className="mt-0.5 truncate text-sm text-navy-600/80">
              {primaryCenter.name}
              {extraCenters > 0 && (
                <span className="text-navy-500">
                  {' '}
                  {t(m.doctors.card.additionalCenters, { count: extraCenters })}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm text-navy-700">{doctor.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge tone="turquoise">
          {t(m.doctors.card.experience, { years: doctor.yearsOfExperience })}
        </Badge>
        {doctor.languages.slice(0, 3).map((lang) => (
          <Badge key={lang} tone="navy">
            {translateLanguage(m, lang)}
          </Badge>
        ))}
      </div>

      {price && (
        <p className="mt-4 text-sm text-navy-600">
          {m.doctors.card.consultationFrom}{' '}
          <span className="font-semibold text-navy-900">{price}</span>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <LinkButton href={`/doctors/${doctor.slug}`} variant="outline" size="sm" className="flex-1">
          {m.doctors.card.viewProfile}
        </LinkButton>
        <LinkButton
          href={`/appointments/request?doctorId=${doctor.id}&doctor=${doctor.slug}`}
          size="sm"
          className="flex-1"
        >
          {m.doctors.card.requestAppointment}
        </LinkButton>
      </div>
    </Card>
  );
}
