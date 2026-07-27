'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_LABELS } from '@mta/shared';
import { adminListAppointments } from '@/lib/api/endpoints';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle, AppointmentStatusBadge } from '@/components/admin/ui';
import { Field, Input, Select } from '@/components/ui/form';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner, Alert, EmptyState } from '@/components/ui/feedback';
import { formatDate } from '@/lib/utils';

export default function AdminAppointmentsPage() {
  const token = useToken();
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('createdAt_desc');
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['admin', 'appointments', { token, status, email, dateFrom, dateTo, sort, page }],
    queryFn: () =>
      adminListAppointments(token, {
        status: status || undefined,
        email: email || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        sort,
        page,
        limit: 15,
      }),
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
  });

  const resetPageAnd = (fn: () => void) => {
    setPage(1);
    fn();
  };

  return (
    <>
      <AdminPageTitle title="Appointment Requests" description="Review and manage incoming requests." />

      <AdminCard className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Status" htmlFor="f-status">
            <Select
              id="f-status"
              value={status}
              onChange={(e) => resetPageAnd(() => setStatus(e.target.value))}
            >
              <option value="">All statuses</option>
              {APPOINTMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {APPOINTMENT_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Email" htmlFor="f-email">
            <Input
              id="f-email"
              value={email}
              onChange={(e) => resetPageAnd(() => setEmail(e.target.value))}
              placeholder="patient@example.com"
            />
          </Field>
          <Field label="Date from" htmlFor="f-from">
            <Input id="f-from" type="date" value={dateFrom} onChange={(e) => resetPageAnd(() => setDateFrom(e.target.value))} />
          </Field>
          <Field label="Date to" htmlFor="f-to">
            <Input id="f-to" type="date" value={dateTo} onChange={(e) => resetPageAnd(() => setDateTo(e.target.value))} />
          </Field>
          <Field label="Sort" htmlFor="f-sort">
            <Select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="createdAt_desc">Newest first</option>
              <option value="createdAt_asc">Oldest first</option>
              <option value="preferredDate_asc">Preferred date ↑</option>
              <option value="preferredDate_desc">Preferred date ↓</option>
            </Select>
          </Field>
        </div>
      </AdminCard>

      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}
      {query.isError && <Alert tone="error">Unable to load appointment requests.</Alert>}

      {query.data && query.data.data.length === 0 && (
        <EmptyState title="No appointment requests found" description="Try adjusting your filters." />
      )}

      {query.data && query.data.data.length > 0 && (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-navy-500">
                <tr>
                  <th className="py-2 pr-4">Reference</th>
                  <th className="py-2 pr-4">Patient</th>
                  <th className="py-2 pr-4">Preferred date</th>
                  <th className="py-2 pr-4">Doctor / Specialty</th>
                  <th className="py-2 pr-4">Submitted</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {query.data.data.map((appt) => (
                  <tr key={appt.id} className="hover:bg-navy-50/50">
                    <td className="py-2.5 pr-4">
                      <Link
                        href={`/admin/appointments/${appt.id}`}
                        className="font-medium text-brand-700 hover:underline"
                      >
                        {appt.referenceNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4">
                      {appt.firstName} {appt.lastName}
                      <span className="block text-xs text-navy-500">{appt.country}</span>
                    </td>
                    <td className="py-2.5 pr-4">{appt.preferredDate}</td>
                    <td className="py-2.5 pr-4">
                      {appt.doctor?.fullName ?? '—'}
                      <span className="block text-xs text-navy-500">{appt.specialty.name}</span>
                    </td>
                    <td className="py-2.5 pr-4">{formatDate(appt.createdAt)}</td>
                    <td className="py-2.5">
                      <AppointmentStatusBadge status={appt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={query.data.pagination} onPageChange={setPage} />
        </AdminCard>
      )}
    </>
  );
}
