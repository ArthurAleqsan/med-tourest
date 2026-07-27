import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { connectDatabase, disconnectDatabase } from '../config/db';
import { logger } from '../config/logger';
import { Specialty } from '../models/Specialty';
import { MedicalCenter } from '../models/MedicalCenter';
import { Package } from '../models/Package';
import { Doctor } from '../models/Doctor';
import { AdminUser } from '../models/AdminUser';
import { slugify } from '../utils/slugify';
import { seedCenters, seedDoctors, seedPackages, seedSpecialties } from './data';

async function seedDatabase(): Promise<void> {
  await connectDatabase(env.MONGODB_URI);

  logger.info('Clearing specialties, medical centers, packages and doctors');
  await Promise.all([
    Specialty.deleteMany({}),
    MedicalCenter.deleteMany({}),
    Package.deleteMany({}),
    Doctor.deleteMany({}),
  ]);

  logger.info('Seeding specialties');
  const specialtyDocs = await Specialty.insertMany(
    seedSpecialties.map((s) => ({
      ...s,
      slug: slugify(s.name),
      isActive: true,
    })),
  );
  const slugToId = new Map(specialtyDocs.map((doc) => [doc.slug, doc._id]));

  logger.info('Seeding medical centers');
  const centerDocs = await MedicalCenter.insertMany(
    seedCenters.map((c) => ({
      ...c,
      slug: slugify(c.name),
      isActive: true,
    })),
  );
  const centerSlugToId = new Map(centerDocs.map((doc) => [doc.slug, doc._id]));

  logger.info('Seeding packages');
  const packageDocs = await Package.insertMany(
    seedPackages.map((p) => ({
      ...p,
      slug: slugify(p.name),
      isActive: true,
    })),
  );

  logger.info('Seeding doctors');
  const doctorDocs = seedDoctors.map((d) => {
    const specialtyId = slugToId.get(d.specialtySlug);
    if (!specialtyId) {
      throw new Error(`Seed error: unknown specialty slug "${d.specialtySlug}"`);
    }
    const centerIds = d.centerSlugs.map((centerSlug) => {
      const centerId = centerSlugToId.get(centerSlug);
      if (!centerId) {
        throw new Error(`Seed error: unknown center slug "${centerSlug}"`);
      }
      return centerId;
    });
    return {
      firstName: d.firstName,
      lastName: d.lastName,
      slug: slugify(`${d.firstName} ${d.lastName}`),
      specialty: specialtyId,
      centers: centerIds,
      photoUrl: d.photoUrl,
      shortDescription: d.shortDescription,
      biography: d.biography,
      education: d.education,
      certifications: d.certifications,
      treatments: d.treatments,
      languages: d.languages,
      yearsOfExperience: d.yearsOfExperience,
      consultationPrice: d.consultationPrice,
      consultationCurrency: d.consultationCurrency,
      isFeatured: d.isFeatured,
      isActive: true,
    };
  });
  await Doctor.insertMany(doctorDocs);

  logger.info('Ensuring admin user');
  const existingAdmin = await AdminUser.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
  if (existingAdmin) {
    logger.info('Admin user already exists, skipping creation', { email: env.ADMIN_EMAIL });
  } else {
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
    await AdminUser.create({
      email: env.ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      firstName: env.ADMIN_FIRST_NAME,
      lastName: env.ADMIN_LAST_NAME,
      role: 'admin',
      isActive: true,
    });
    logger.info('Admin user created', { email: env.ADMIN_EMAIL });
  }

  logger.info('Seed complete', {
    specialties: specialtyDocs.length,
    centers: centerDocs.length,
    packages: packageDocs.length,
    doctors: doctorDocs.length,
  });

  await disconnectDatabase();
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error('Seed failed', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    process.exit(1);
  });
