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
import { L, LA } from './localize';

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
      ...L('name', s.name),
      ...L('shortDescription', s.shortDescription),
      ...L('description', s.description),
      ...LA('treatments', s.treatments),
      icon: s.icon,
      displayOrder: s.displayOrder,
      slug: slugify(s.name),
      isActive: true,
    })),
  );
  const slugToId = new Map(specialtyDocs.map((doc) => [doc.slug, doc._id]));

  logger.info('Seeding medical centers');
  const centerDocs = await MedicalCenter.insertMany(
    seedCenters.map((c) => ({
      ...L('name', c.name),
      ...L('shortDescription', c.shortDescription),
      ...L('description', c.description),
      ...L('address', c.address),
      ...L('city', c.city),
      phone: c.phone,
      email: c.email,
      website: c.website,
      photoUrl: c.photoUrl,
      displayOrder: c.displayOrder,
      slug: slugify(c.name),
      isActive: true,
    })),
  );
  const centerSlugToId = new Map(centerDocs.map((doc) => [doc.slug, doc._id]));

  logger.info('Seeding packages');
  const packageDocs = await Package.insertMany(
    seedPackages.map((p) => ({
      ...L('name', p.name),
      ...L('shortDescription', p.shortDescription),
      ...L('description', p.description),
      durationDays: p.durationDays,
      hotel: {
        ...L('name', p.hotel.name),
        stars: p.hotel.stars,
        nights: p.hotel.nights,
        ...(p.hotel.roomType ? L('roomType', p.hotel.roomType) : {}),
        ...(p.hotel.description ? L('description', p.hotel.description) : {}),
      },
      tours: p.tours.map((tour) => ({
        ...L('title', tour.title),
        ...L('description', tour.description),
      })),
      ...LA('inclusions', p.inclusions),
      priceFrom: p.priceFrom,
      currency: p.currency,
      photoUrl: p.photoUrl,
      displayOrder: p.displayOrder,
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
      ...L('shortDescription', d.shortDescription),
      ...L('biography', d.biography),
      ...LA('education', d.education),
      ...LA('certifications', d.certifications),
      ...LA('treatments', d.treatments),
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
