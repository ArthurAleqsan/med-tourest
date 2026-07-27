import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../app';
import {
  closeTestDatabase,
  connectTestDatabase,
  seedTestData,
  validPreferredDate,
  type SeededData,
} from './helpers';

let app: Express;
let seed: SeededData;

beforeAll(async () => {
  await connectTestDatabase();
  app = createApp();
});

afterAll(async () => {
  await closeTestDatabase();
});

beforeEach(async () => {
  seed = await seedTestData();
});

async function getAdminToken(): Promise<string> {
  const res = await request(app)
    .post('/api/v1/admin/auth/login')
    .send({ email: seed.adminEmail, password: seed.adminPassword });
  return res.body.data.token as string;
}

describe('Health', () => {
  it('reports ok with database connected', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.data.database).toBe('connected');
  });
});

describe('Specialties', () => {
  it('lists active specialties with doctor counts', async () => {
    const res = await request(app).get('/api/v1/specialties');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const cardiology = res.body.data.find((s: { slug: string }) => s.slug === 'cardiology');
    expect(cardiology.doctorCount).toBe(1);
  });

  it('retrieves a specialty by slug', async () => {
    const res = await request(app).get('/api/v1/specialties/cardiology');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Cardiology');
  });

  it('returns 404 for an unknown specialty', async () => {
    const res = await request(app).get('/api/v1/specialties/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('Doctors', () => {
  it('only returns active doctors and paginates', async () => {
    const res = await request(app).get('/api/v1/doctors');
    expect(res.status).toBe(200);
    expect(res.body.data.data).toHaveLength(1);
    expect(res.body.data.data[0].slug).toBe('aram-grigoryan');
    expect(res.body.data.pagination.totalItems).toBe(1);
  });

  it('filters by specialty slug', async () => {
    const res = await request(app).get('/api/v1/doctors?specialty=cardiology');
    expect(res.body.data.data).toHaveLength(1);
    const none = await request(app).get('/api/v1/doctors?specialty=dermatology');
    expect(none.body.data.data).toHaveLength(0);
  });

  it('filters by language', async () => {
    const match = await request(app).get('/api/v1/doctors?language=English');
    expect(match.body.data.data).toHaveLength(1);
    const noMatch = await request(app).get('/api/v1/doctors?language=Spanish');
    expect(noMatch.body.data.data).toHaveLength(0);
  });

  it('returns featured doctors', async () => {
    const res = await request(app).get('/api/v1/doctors/featured');
    expect(res.body.data).toHaveLength(1);
  });

  it('includes populated medical centers on each doctor', async () => {
    const res = await request(app).get('/api/v1/doctors');
    const doctor = res.body.data.data[0];
    expect(Array.isArray(doctor.centers)).toBe(true);
    expect(doctor.centers[0].slug).toBe('erebuni-medical-center');
  });

  it('filters by medical center slug', async () => {
    const match = await request(app).get('/api/v1/doctors?center=erebuni-medical-center');
    expect(match.body.data.data).toHaveLength(1);
    const noMatch = await request(app).get('/api/v1/doctors?center=does-not-exist');
    expect(noMatch.body.data.data).toHaveLength(0);
  });
});

describe('Medical centers', () => {
  it('lists active centers with active-doctor counts', async () => {
    const res = await request(app).get('/api/v1/centers');
    expect(res.status).toBe(200);
    const erebuni = res.body.data.find((c: { slug: string }) => c.slug === 'erebuni-medical-center');
    expect(erebuni).toBeTruthy();
    // Only the active doctor is counted.
    expect(erebuni.doctorCount).toBe(1);
  });

  it('retrieves a center by slug', async () => {
    const res = await request(app).get('/api/v1/centers/erebuni-medical-center');
    expect(res.status).toBe(200);
    expect(res.body.data.city).toBe('Yerevan');
  });

  it('returns 404 for an unknown center', async () => {
    const res = await request(app).get('/api/v1/centers/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('Packages', () => {
  it('lists only active packages', async () => {
    const res = await request(app).get('/api/v1/packages');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].slug).toBe('10-day-dental-discovery-package');
    expect(res.body.data[0].durationDays).toBe(10);
  });

  it('retrieves a package by slug with hotel and tours', async () => {
    const res = await request(app).get('/api/v1/packages/10-day-dental-discovery-package');
    expect(res.status).toBe(200);
    expect(res.body.data.hotel.name).toBe('Grand Hotel Yerevan');
    expect(res.body.data.tours[0].title).toBe('Yerevan city tour');
    expect(res.body.data.inclusions.length).toBeGreaterThan(0);
  });

  it('does not expose an inactive package', async () => {
    const res = await request(app).get('/api/v1/packages/hidden-package');
    expect(res.status).toBe(404);
  });

  it('returns 404 for an unknown package', async () => {
    const res = await request(app).get('/api/v1/packages/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('Appointment requests', () => {
  const basePayload = () => ({
    specialtyId: seed.specialtyId,
    preferredDate: validPreferredDate(),
    preferredTimePeriod: 'morning',
    firstName: 'Maria',
    lastName: 'Ivanova',
    email: 'maria@example.com',
    country: 'Georgia',
    preferredContactMethod: 'telegram',
    contactValue: '@maria_iv',
    consentAccepted: true,
  });

  it('creates a request and returns a reference number', async () => {
    const res = await request(app).post('/api/v1/appointment-requests').send(basePayload());
    expect(res.status).toBe(201);
    expect(res.body.data.referenceNumber).toMatch(/^ARM-\d{4}-\d{6}$/);
    expect(res.body.data.status).toBe('new');
  });

  it('rejects a past preferred date', async () => {
    const res = await request(app)
      .post('/api/v1/appointment-requests')
      .send({ ...basePayload(), preferredDate: '2000-01-01' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a date beyond one month', async () => {
    const res = await request(app)
      .post('/api/v1/appointment-requests')
      .send({ ...basePayload(), preferredDate: '2099-01-01' });
    expect(res.status).toBe(400);
  });

  it('requires consent', async () => {
    const res = await request(app)
      .post('/api/v1/appointment-requests')
      .send({ ...basePayload(), consentAccepted: false });
    expect(res.status).toBe(400);
  });

  it('rejects an invalid telegram contact value', async () => {
    const res = await request(app)
      .post('/api/v1/appointment-requests')
      .send({ ...basePayload(), contactValue: 'has spaces!' });
    expect(res.status).toBe(400);
  });

  it('public status lookup does not expose private data', async () => {
    const created = await request(app).post('/api/v1/appointment-requests').send(basePayload());
    const ref = created.body.data.referenceNumber;
    const res = await request(app).get(`/api/v1/appointment-requests/${ref}`);
    expect(res.status).toBe(200);
    const body = res.body.data;
    expect(body.referenceNumber).toBe(ref);
    expect(body.specialtyName).toBe('Cardiology');
    // Privacy: none of these fields may be present.
    expect(body.email).toBeUndefined();
    expect(body.contactValue).toBeUndefined();
    expect(body.medicalInformation).toBeUndefined();
    expect(body.internalNotes).toBeUndefined();
    expect(body.firstName).toBeUndefined();
  });
});

describe('Admin authentication & authorization', () => {
  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: seed.adminEmail, password: seed.adminPassword });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.email).toBe(seed.adminEmail.toLowerCase());
  });

  it('rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: seed.adminEmail, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('blocks protected routes without a token', async () => {
    const res = await request(app).get('/api/v1/admin/appointment-requests');
    expect(res.status).toBe(401);
  });

  it('blocks protected routes with an invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/admin/appointment-requests')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });

  it('allows protected routes with a valid token and exposes full data', async () => {
    await request(app).post('/api/v1/appointment-requests').send({
      specialtyId: seed.specialtyId,
      preferredDate: validPreferredDate(),
      preferredTimePeriod: 'morning',
      firstName: 'Maria',
      lastName: 'Ivanova',
      email: 'maria@example.com',
      country: 'Georgia',
      preferredContactMethod: 'telegram',
      contactValue: '@maria_iv',
      consentAccepted: true,
    });
    const token = await getAdminToken();
    const res = await request(app)
      .get('/api/v1/admin/appointment-requests')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.data[0].email).toBe('maria@example.com');
    expect(res.body.data.data[0].contactValue).toBe('@maria_iv');
  });
});
