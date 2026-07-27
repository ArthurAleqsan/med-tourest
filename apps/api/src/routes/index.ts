import { Router } from 'express';
import {
  adminLoginSchema,
  appointmentAdminListQuerySchema,
  appointmentAdminUpdateSchema,
  appointmentRequestInputSchema,
  appointmentStatusUpdateSchema,
  centerListQuerySchema,
  contactRequestInputSchema,
  contactStatusUpdateSchema,
  doctorInputSchema,
  doctorListQuerySchema,
  doctorUpdateSchema,
  medicalCenterInputSchema,
  medicalCenterUpdateSchema,
  packageInputSchema,
  packageListQuerySchema,
  packageUpdateSchema,
  specialtyInputSchema,
  specialtyListQuerySchema,
  specialtyUpdateSchema,
} from '@mta/shared';
import { validateBody, validateQuery } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { loginLimiter, publicFormLimiter } from '../middleware/rateLimit';

import { getHealth } from '../controllers/health.controller';
import * as specialties from '../controllers/specialty.controller';
import * as centers from '../controllers/center.controller';
import * as packages from '../controllers/package.controller';
import * as doctors from '../controllers/doctor.controller';
import * as appointments from '../controllers/appointment.controller';
import * as contacts from '../controllers/contact.controller';
import * as admin from '../controllers/admin.controller';

export const apiRouter = Router();

// --- Health ---------------------------------------------------------------
apiRouter.get('/health', getHealth);

// --- Public: Specialties --------------------------------------------------
apiRouter.get('/specialties', validateQuery(specialtyListQuerySchema), specialties.listSpecialties);
apiRouter.get('/specialties/:slug', specialties.getSpecialty);

// --- Public: Medical centers ----------------------------------------------
apiRouter.get('/centers', validateQuery(centerListQuerySchema), centers.listCenters);
apiRouter.get('/centers/:slug', centers.getCenter);

// --- Public: Packages -----------------------------------------------------
apiRouter.get('/packages', validateQuery(packageListQuerySchema), packages.listPackages);
apiRouter.get('/packages/:slug', packages.getPackage);

// --- Public: Doctors ------------------------------------------------------
apiRouter.get('/doctors', validateQuery(doctorListQuerySchema), doctors.listDoctors);
apiRouter.get('/doctors/featured', doctors.listFeaturedDoctors);
apiRouter.get('/doctors/:slug', doctors.getDoctor);

// --- Public: Appointment requests ----------------------------------------
apiRouter.post(
  '/appointment-requests',
  publicFormLimiter,
  validateBody(appointmentRequestInputSchema),
  appointments.createAppointmentRequest,
);
apiRouter.get('/appointment-requests/:referenceNumber', appointments.getPublicStatus);

// --- Public: Contact requests --------------------------------------------
apiRouter.post(
  '/contact-requests',
  publicFormLimiter,
  validateBody(contactRequestInputSchema),
  contacts.createContactRequest,
);

// --- Admin: Authentication ------------------------------------------------
const adminRouter = Router();
adminRouter.post('/auth/login', loginLimiter, validateBody(adminLoginSchema), admin.login);

// Everything below requires a valid JWT.
adminRouter.use(requireAuth);
adminRouter.get('/auth/me', admin.me);
adminRouter.get('/dashboard', admin.dashboard);

// Admin: Specialties
adminRouter.get('/specialties', specialties.adminListSpecialties);
adminRouter.get('/specialties/:id', specialties.adminGetSpecialty);
adminRouter.post('/specialties', validateBody(specialtyInputSchema), specialties.createSpecialty);
adminRouter.patch(
  '/specialties/:id',
  validateBody(specialtyUpdateSchema),
  specialties.updateSpecialty,
);
adminRouter.delete('/specialties/:id', specialties.deleteSpecialty);

// Admin: Medical centers
adminRouter.get('/centers', centers.adminListCenters);
adminRouter.get('/centers/:id', centers.adminGetCenter);
adminRouter.post('/centers', validateBody(medicalCenterInputSchema), centers.createCenter);
adminRouter.patch('/centers/:id', validateBody(medicalCenterUpdateSchema), centers.updateCenter);
adminRouter.delete('/centers/:id', centers.deleteCenter);

// Admin: Packages
adminRouter.get('/packages', packages.adminListPackages);
adminRouter.get('/packages/:id', packages.adminGetPackage);
adminRouter.post('/packages', validateBody(packageInputSchema), packages.createPackage);
adminRouter.patch('/packages/:id', validateBody(packageUpdateSchema), packages.updatePackage);
adminRouter.delete('/packages/:id', packages.deletePackage);

// Admin: Doctors
adminRouter.get('/doctors', validateQuery(doctorListQuerySchema), doctors.adminListDoctors);
adminRouter.get('/doctors/:id', doctors.adminGetDoctor);
adminRouter.post('/doctors', validateBody(doctorInputSchema), doctors.createDoctor);
adminRouter.patch('/doctors/:id', validateBody(doctorUpdateSchema), doctors.updateDoctor);
adminRouter.delete('/doctors/:id', doctors.deleteDoctor);

// Admin: Appointment requests
adminRouter.get(
  '/appointment-requests',
  validateQuery(appointmentAdminListQuerySchema),
  appointments.listAppointmentRequests,
);
adminRouter.get('/appointment-requests/:id', appointments.getAppointmentRequest);
adminRouter.patch(
  '/appointment-requests/:id/status',
  validateBody(appointmentStatusUpdateSchema),
  appointments.updateAppointmentStatus,
);
adminRouter.patch(
  '/appointment-requests/:id',
  validateBody(appointmentAdminUpdateSchema),
  appointments.updateAppointmentRequest,
);

// Admin: Contact requests
adminRouter.get('/contact-requests', contacts.listContactRequests);
adminRouter.patch(
  '/contact-requests/:id/status',
  validateBody(contactStatusUpdateSchema),
  contacts.updateContactStatus,
);

apiRouter.use('/admin', adminRouter);
