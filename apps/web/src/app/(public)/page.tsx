import type { DoctorDto, MedicalCenterDto, SpecialtyDto } from '@mta/shared';
import { getCenters, getFeaturedDoctors, getSpecialties } from '@/lib/api/endpoints';
import { HomeCenters } from '@/components/home/HomeCenters';
import { SpecialtiesSection } from '@/components/home/SpecialtiesSection';
import { FeaturedDoctors } from '@/components/home/FeaturedDoctors';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhyArmenia } from '@/components/home/WhyArmenia';
import { Services } from '@/components/home/Services';
import { Testimonials } from '@/components/home/Testimonials';
import { Faq } from '@/components/home/Faq';
import { CtaBand } from '@/components/home/CtaBand';

// Rendered dynamically so the page works even if the API is unavailable at build time.
export const dynamic = 'force-dynamic';

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [specialties, featured, centers] = await Promise.all([
    safeFetch<SpecialtyDto[]>(() => getSpecialties(), []),
    safeFetch<DoctorDto[]>(() => getFeaturedDoctors(), []),
    safeFetch<MedicalCenterDto[]>(() => getCenters(), []),
  ]);

  return (
    <>
      <HomeCenters centers={centers} />
      <SpecialtiesSection specialties={specialties} />
      <FeaturedDoctors doctors={featured} />
      <HowItWorks />
      <WhyArmenia />
      <Services />
      <Testimonials />
      <Faq />
      <CtaBand />
    </>
  );
}
