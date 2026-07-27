import type { MetadataRoute } from 'next';
import type { DoctorDto, MedicalCenterDto, PackageDto, SpecialtyDto } from '@mta/shared';
import { getCenters, getDoctors, getPackages, getSpecialties } from '@/lib/api/endpoints';
import { SITE_URL } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/doctors',
    '/centers',
    '/packages',
    '/appointments/request',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  let doctors: DoctorDto[] = [];
  let specialties: SpecialtyDto[] = [];
  let centers: MedicalCenterDto[] = [];
  let packages: PackageDto[] = [];
  try {
    const [doctorResult, specialtyResult, centerResult, packageResult] = await Promise.all([
      getDoctors({ limit: 100 }),
      getSpecialties(),
      getCenters(),
      getPackages(),
    ]);
    doctors = doctorResult.data;
    specialties = specialtyResult;
    centers = centerResult;
    packages = packageResult;
  } catch {
    // If the API is unreachable, return static routes only.
  }

  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((doctor) => ({
    url: `${SITE_URL}/doctors/${doctor.slug}`,
    lastModified: new Date(doctor.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const specialtyRoutes: MetadataRoute.Sitemap = specialties.map((specialty) => ({
    url: `${SITE_URL}/specialties/${specialty.slug}`,
    lastModified: new Date(specialty.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const centerRoutes: MetadataRoute.Sitemap = centers.map((center) => ({
    url: `${SITE_URL}/centers/${center.slug}`,
    lastModified: new Date(center.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${SITE_URL}/packages/${pkg.slug}`,
    lastModified: new Date(pkg.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...doctorRoutes, ...specialtyRoutes, ...centerRoutes, ...packageRoutes];
}
