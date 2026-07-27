import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { getAppointmentDateRange } from '@mta/shared';
import { connectDatabase, disconnectDatabase } from '../config/db';
import { env } from '../config/env';
import { Specialty } from '../models/Specialty';
import { MedicalCenter } from '../models/MedicalCenter';
import { Package } from '../models/Package';
import { Doctor } from '../models/Doctor';
import { AdminUser } from '../models/AdminUser';

export interface SeededData {
  specialtyId: string;
  specialtySlug: string;
  centerId: string;
  centerSlug: string;
  packageId: string;
  packageSlug: string;
  activeDoctorId: string;
  activeDoctorSlug: string;
  adminEmail: string;
  adminPassword: string;
}

export async function connectTestDatabase(): Promise<void> {
  await connectDatabase(env.MONGODB_URI);
}

export async function clearDatabase(): Promise<void> {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}

export async function closeTestDatabase(): Promise<void> {
  await clearDatabase();
  await disconnectDatabase();
}

export async function seedTestData(): Promise<SeededData> {
  await clearDatabase();

  const specialty = await Specialty.create({
    name: 'Cardiology',
    slug: 'cardiology',
    shortDescription: 'Heart care and diagnostics for the cardiovascular system.',
    description: 'Comprehensive cardiovascular care with modern diagnostics and treatment.',
    treatments: ['Echocardiography'],
    isActive: true,
    displayOrder: 1,
  });

  const otherSpecialty = await Specialty.create({
    name: 'Dermatology',
    slug: 'dermatology',
    shortDescription: 'Skin, hair, and nail health for patients of all ages.',
    description: 'Medical and cosmetic dermatology services.',
    treatments: ['Acne treatment'],
    isActive: true,
    displayOrder: 2,
  });

  const center = await MedicalCenter.create({
    name: 'Erebuni Medical Center',
    slug: 'erebuni-medical-center',
    shortDescription: 'Leading center for cardiology and emergency medicine.',
    description: 'A large clinical hospital recognized for cardiology and emergency care.',
    address: '14 Titogradyan Street, Yerevan, Armenia',
    city: 'Yerevan',
    isActive: true,
    displayOrder: 1,
  });

  const treatmentPackage = await Package.create({
    name: '10-Day Dental & Discovery Package',
    slug: '10-day-dental-discovery-package',
    durationDays: 10,
    shortDescription: 'Dental treatment combined with a relaxing Armenian getaway.',
    description: 'A complete 10-day dental treatment trip bundled with hotel, transfers, and tours.',
    hotel: {
      name: 'Grand Hotel Yerevan',
      stars: 4,
      roomType: 'Deluxe double room',
      nights: 9,
      description: 'A comfortable 4-star hotel in central Yerevan.',
    },
    tours: [{ title: 'Yerevan city tour', description: 'A half-day guided walk through the city.' }],
    inclusions: ['Airport pick-up and drop-off', 'English-speaking coordinator'],
    priceFrom: 1200,
    currency: 'USD',
    isActive: true,
    displayOrder: 1,
  });

  // Inactive package: must never appear in public results.
  await Package.create({
    name: 'Hidden Package',
    slug: 'hidden-package',
    durationDays: 5,
    shortDescription: 'This package is inactive and should be hidden from the public.',
    description: 'An inactive package used to verify public filtering behaviour.',
    hotel: { name: 'Some Hotel' },
    tours: [],
    inclusions: [],
    isActive: false,
    displayOrder: 2,
  });

  const activeDoctor = await Doctor.create({
    firstName: 'Aram',
    lastName: 'Grigoryan',
    slug: 'aram-grigoryan',
    specialty: specialty._id,
    centers: [center._id],
    shortDescription: 'Experienced interventional cardiologist.',
    biography: 'A cardiologist with two decades of clinical experience in Armenia.',
    education: ['MD, Yerevan State Medical University'],
    certifications: ['Board Certified in Cardiology'],
    treatments: ['Echocardiography'],
    languages: ['Armenian', 'English', 'Russian'],
    yearsOfExperience: 20,
    isFeatured: true,
    isActive: true,
  });

  // Inactive doctor: must never appear in public results.
  await Doctor.create({
    firstName: 'Hidden',
    lastName: 'Doctor',
    slug: 'hidden-doctor',
    specialty: otherSpecialty._id,
    centers: [center._id],
    shortDescription: 'This doctor is inactive and should be hidden.',
    biography: 'An inactive doctor used to verify public filtering behavior.',
    languages: ['French'],
    yearsOfExperience: 5,
    isFeatured: false,
    isActive: false,
  });

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  await AdminUser.create({
    email: env.ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    firstName: 'Test',
    lastName: 'Admin',
    role: 'admin',
    isActive: true,
  });

  return {
    specialtyId: String(specialty._id),
    specialtySlug: specialty.slug,
    centerId: String(center._id),
    centerSlug: center.slug,
    packageId: String(treatmentPackage._id),
    packageSlug: treatmentPackage.slug,
    activeDoctorId: String(activeDoctor._id),
    activeDoctorSlug: activeDoctor.slug,
    adminEmail: env.ADMIN_EMAIL,
    adminPassword: env.ADMIN_PASSWORD,
  };
}

/** A valid preferred date inside the allowed window. */
export function validPreferredDate(): string {
  return getAppointmentDateRange().min;
}
