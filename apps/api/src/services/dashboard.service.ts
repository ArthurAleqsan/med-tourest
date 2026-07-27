import type { AdminDashboardSummary } from '@mta/shared';
import { getBusinessToday, storageDateToDateOnly } from '@mta/shared';
import { Doctor } from '../models/Doctor';
import { Specialty } from '../models/Specialty';
import { AppointmentRequest } from '../models/AppointmentRequest';
import { ContactRequest } from '../models/ContactRequest';

export async function getDashboardSummary(): Promise<AdminDashboardSummary> {
  const todayStart = new Date(`${getBusinessToday()}T00:00:00.000Z`);

  const [
    totalDoctors,
    totalActiveDoctors,
    totalSpecialties,
    newAppointmentRequests,
    totalAppointmentRequests,
    newContactRequests,
    upcomingDocs,
  ] = await Promise.all([
    Doctor.countDocuments({}),
    Doctor.countDocuments({ isActive: true }),
    Specialty.countDocuments({}),
    AppointmentRequest.countDocuments({ status: 'new' }),
    AppointmentRequest.countDocuments({}),
    ContactRequest.countDocuments({ status: 'new' }),
    AppointmentRequest.find({
      preferredDate: { $gte: todayStart },
      status: { $in: ['new', 'contacted', 'pending_confirmation', 'confirmed'] },
    })
      .populate('doctor', 'firstName lastName')
      .populate('specialty', 'name')
      .sort({ preferredDate: 1 })
      .limit(10)
      .lean(),
  ]);

  const upcomingAppointments = upcomingDocs.map((doc) => {
    const doctor = doc.doctor as unknown as { firstName?: string; lastName?: string } | null;
    const specialty = doc.specialty as unknown as { name?: string } | null;
    return {
      id: String(doc._id),
      referenceNumber: doc.referenceNumber,
      preferredDate: storageDateToDateOnly(doc.preferredDate),
      doctorName:
        doctor && doctor.firstName ? `${doctor.firstName} ${doctor.lastName ?? ''}`.trim() : undefined,
      specialtyName: specialty?.name ?? '',
      status: doc.status,
    };
  });

  return {
    totalDoctors,
    totalActiveDoctors,
    totalSpecialties,
    newAppointmentRequests,
    totalAppointmentRequests,
    newContactRequests,
    upcomingAppointments,
  };
}
