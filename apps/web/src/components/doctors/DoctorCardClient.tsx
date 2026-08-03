'use client';

import type { DoctorDto } from '@mta/shared';
import { formatPrice } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import { useLocalized } from '@/lib/useLocalized';
import { translateLanguage } from '@/lib/languages';
import { DoctorCardView } from '@/components/doctors/DoctorCardView';

/** Client doctor card for interactive browsers (e.g. DoctorsBrowser). */
export function DoctorCardClient({ doctor }: { doctor: DoctorDto }) {
  const { m, t } = useI18n();
  const { locale, loc } = useLocalized();
  const price = formatPrice(doctor.consultationPrice, doctor.consultationCurrency, locale);
  const specialtyName = doctor.specialty ? loc(doctor.specialty, 'name') : '';
  const shortDescription = loc(doctor, 'shortDescription');
  const centers = doctor.centers ?? [];
  const primaryCenter = centers[0];
  const extraCenters = centers.length - 1;
  const languages = (doctor.languages ?? []).slice(0, 3).map((lang) => translateLanguage(m, lang));

  return (
    <DoctorCardView
      slug={doctor.slug}
      id={doctor.id}
      fullName={doctor.fullName}
      photoUrl={doctor.photoUrl}
      specialtyName={specialtyName}
      shortDescription={shortDescription}
      primaryCenterName={primaryCenter ? loc(primaryCenter, 'name') : undefined}
      extraCenters={extraCenters}
      experienceLabel={t(m.doctors.card.experience, { years: doctor.yearsOfExperience })}
      languages={languages}
      price={price}
      doctorPrefix={m.common.doctorPrefix}
      portraitAlt={t(m.doctors.card.portraitAlt, { name: doctor.fullName })}
      additionalCentersLabel={t(m.doctors.card.additionalCenters, { count: extraCenters })}
      consultationFromLabel={m.doctors.card.consultationFrom}
      viewProfileLabel={m.doctors.card.viewProfile}
      requestAppointmentLabel={m.doctors.card.requestAppointment}
    />
  );
}
