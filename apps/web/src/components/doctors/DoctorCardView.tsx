import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';

/** Presentational doctor card — safe to use from both server and client components. */
export function DoctorCardView({
  slug,
  id,
  fullName,
  photoUrl,
  specialtyName,
  shortDescription,
  primaryCenterName,
  extraCenters,
  experienceLabel,
  languages,
  price,
  doctorPrefix,
  portraitAlt,
  additionalCentersLabel,
  consultationFromLabel,
  viewProfileLabel,
  requestAppointmentLabel,
}: {
  slug: string;
  id: string;
  fullName: string;
  photoUrl?: string;
  specialtyName: string;
  shortDescription: string;
  primaryCenterName?: string;
  extraCenters: number;
  experienceLabel: string;
  languages: string[];
  price: string | null;
  doctorPrefix: string;
  portraitAlt: string;
  additionalCentersLabel: string;
  consultationFromLabel: string;
  viewProfileLabel: string;
  requestAppointmentLabel: string;
}) {
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start gap-4">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-navy-100">
          <img
            src={photoUrl || 'https://placehold.co/160x160?text=Doctor'}
            alt={portraitAlt}
            className="absolute inset-0 h-full w-full object-contain object-center"
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-navy-900">
            {doctorPrefix} {fullName}
          </h3>
          <p className="text-sm font-medium text-brand-700">{specialtyName}</p>
          {primaryCenterName && (
            <p className="mt-0.5 truncate text-sm text-navy-600/80">
              {primaryCenterName}
              {extraCenters > 0 && (
                <span className="text-navy-500"> {additionalCentersLabel}</span>
              )}
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm text-navy-700">{shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge tone="turquoise">{experienceLabel}</Badge>
        {languages.map((lang) => (
          <Badge key={lang} tone="navy">
            {lang}
          </Badge>
        ))}
      </div>

      {price && (
        <p className="mt-4 text-sm text-navy-600">
          {consultationFromLabel} <span className="font-semibold text-navy-900">{price}</span>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <LinkButton href={`/doctors/${slug}`} variant="outline" size="sm" className="flex-1">
          {viewProfileLabel}
        </LinkButton>
        <LinkButton
          href={`/appointments/request?doctorId=${id}&doctor=${slug}`}
          size="sm"
          className="flex-1"
        >
          {requestAppointmentLabel}
        </LinkButton>
      </div>
    </Card>
  );
}
