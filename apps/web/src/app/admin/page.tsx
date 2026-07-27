'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminDashboard } from '@/lib/api/endpoints';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle, AppointmentStatusBadge } from '@/components/admin/ui';
import { Spinner, Alert } from '@/components/ui/feedback';

const stats = [
  { key: 'totalActiveDoctors', label: 'Active doctors' },
  { key: 'totalSpecialties', label: 'Specialties' },
  { key: 'newAppointmentRequests', label: 'New requests' },
  { key: 'newContactRequests', label: 'New contact messages' },
] as const;

export default function AdminDashboardPage() {
  const token = useToken();
  const query = useQuery({
    queryKey: ['admin', 'dashboard', token],
    queryFn: () => adminDashboard(token),
    enabled: Boolean(token),
  });

  return (
    <>
      <AdminPageTitle title="Dashboard" description="Overview of platform activity." />

      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {query.isError && <Alert tone="error">Unable to load dashboard data.</Alert>}

      {query.data && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <AdminCard key={stat.key}>
                <p className="text-sm text-navy-600">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-navy-900">{query.data[stat.key]}</p>
              </AdminCard>
            ))}
          </div>

          <AdminCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy-900">Upcoming requested dates</h2>
              <Link href="/admin/appointments" className="text-sm font-medium text-brand-700 hover:underline">
                View all
              </Link>
            </div>
            {query.data.upcomingAppointments.length === 0 ? (
              <p className="text-sm text-navy-500">No upcoming requested appointments.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-navy-500">
                    <tr>
                      <th className="py-2 pr-4">Reference</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Doctor</th>
                      <th className="py-2 pr-4">Specialty</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {query.data.upcomingAppointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="py-2 pr-4">
                          <Link
                            href={`/admin/appointments/${appt.id}`}
                            className="font-medium text-brand-700 hover:underline"
                          >
                            {appt.referenceNumber}
                          </Link>
                        </td>
                        <td className="py-2 pr-4">{appt.preferredDate}</td>
                        <td className="py-2 pr-4">{appt.doctorName ?? '—'}</td>
                        <td className="py-2 pr-4">{appt.specialtyName}</td>
                        <td className="py-2">
                          <AppointmentStatusBadge status={appt.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>
        </div>
      )}
    </>
  );
}
