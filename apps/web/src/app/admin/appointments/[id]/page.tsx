'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_LABELS,
  TIME_PERIOD_LABELS,
} from '@mta/shared';
import { adminGetAppointment, adminUpdateAppointmentStatus } from '@/lib/api/endpoints';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle, AppointmentStatusBadge } from '@/components/admin/ui';
import { Field, Select, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Spinner, Alert } from '@/components/ui/feedback';
import { formatDate } from '@/lib/utils';

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-navy-100 py-2 sm:flex-row sm:justify-between">
      <dt className="text-sm text-navy-500">{label}</dt>
      <dd className="text-sm font-medium text-navy-900 sm:text-right">{value || '—'}</dd>
    </div>
  );
}

export default function AdminAppointmentDetailPage({ params }: { params: { id: string } }) {
  const token = useToken();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  const query = useQuery({
    queryKey: ['admin', 'appointment', params.id, token],
    queryFn: () => adminGetAppointment(token, params.id),
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (query.data) {
      setStatus(query.data.status);
      setNotes(query.data.internalNotes ?? '');
    }
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: () => adminUpdateAppointmentStatus(token, params.id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointment', params.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] });
    },
  });

  return (
    <>
      <AdminPageTitle
        title="Appointment Request"
        action={
          <Link href="/admin/appointments" className="text-sm font-medium text-brand-700 hover:underline">
            ← Back to list
          </Link>
        }
      />

      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}
      {query.isError && <Alert tone="error">Unable to load this appointment request.</Alert>}

      {query.data && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <AdminCard>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-500">Reference</p>
                <p className="text-xl font-bold text-navy-900">{query.data.referenceNumber}</p>
              </div>
              <AppointmentStatusBadge status={query.data.status} />
            </div>
            <dl>
              <Row label="Patient" value={`${query.data.firstName} ${query.data.lastName}`} />
              <Row label="Email" value={query.data.email} />
              <Row label="Country" value={query.data.country} />
              <Row label="Phone" value={query.data.phoneNumber} />
              <Row
                label="Preferred contact"
                value={`${query.data.preferredContactMethod}: ${query.data.contactValue}`}
              />
              <Row label="Preferred date" value={query.data.preferredDate} />
              <Row
                label="Time period"
                value={TIME_PERIOD_LABELS[query.data.preferredTimePeriod]}
              />
              <Row label="Doctor" value={query.data.doctor?.fullName} />
              <Row label="Specialty" value={query.data.specialty.name} />
              <Row label="Submitted" value={formatDate(query.data.createdAt)} />
            </dl>

            {query.data.medicalInformation && (
              <div className="mt-4">
                <p className="text-sm font-medium text-navy-800">Medical information</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-navy-700">
                  {query.data.medicalInformation}
                </p>
              </div>
            )}
            {query.data.message && (
              <div className="mt-4">
                <p className="text-sm font-medium text-navy-800">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-navy-700">{query.data.message}</p>
              </div>
            )}
          </AdminCard>

          <AdminCard className="lg:sticky lg:top-6 lg:self-start">
            <h2 className="text-lg font-semibold text-navy-900">Manage request</h2>
            {mutation.isSuccess && <Alert tone="success" className="mt-3">Changes saved.</Alert>}
            {mutation.isError && <Alert tone="error" className="mt-3">Unable to save changes.</Alert>}
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
              }}
            >
              <Field label="Status" htmlFor="status">
                <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {APPOINTMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {APPOINTMENT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Internal notes" htmlFor="notes" hint="Only visible to admins.">
                <Textarea
                  id="notes"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
              <Button type="submit" fullWidth disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </form>
          </AdminCard>
        </div>
      )}
    </>
  );
}
