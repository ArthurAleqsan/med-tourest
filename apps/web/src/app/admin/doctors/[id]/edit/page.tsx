'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { DoctorInput } from '@mta/shared';
import { adminGetDoctor, adminUpdateDoctor } from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle } from '@/components/admin/ui';
import { DoctorForm } from '@/components/admin/DoctorForm';
import { Spinner, Alert } from '@/components/ui/feedback';

export default function EditDoctorPage({ params }: { params: { id: string } }) {
  const token = useToken();
  const router = useRouter();

  const query = useQuery({
    queryKey: ['admin', 'doctor', params.id, token],
    queryFn: () => adminGetDoctor(token, params.id),
    enabled: Boolean(token),
  });

  const mutation = useMutation({
    mutationFn: (payload: DoctorInput) => adminUpdateDoctor(token, params.id, payload),
    onSuccess: () => router.push('/admin/doctors'),
  });

  const errorMessage =
    mutation.error instanceof ApiRequestError
      ? mutation.error.fieldErrors?.map((e) => e.message).join(' ') ?? mutation.error.message
      : mutation.isError
        ? 'Unable to update doctor.'
        : null;

  return (
    <>
      <AdminPageTitle title="Edit doctor" />
      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}
      {query.isError && <Alert tone="error">Unable to load this doctor.</Alert>}
      {query.data && (
        <AdminCard>
          <DoctorForm
            initial={query.data}
            submitting={mutation.isPending}
            errorMessage={errorMessage}
            onSubmit={(payload) => mutation.mutate(payload)}
          />
        </AdminCard>
      )}
    </>
  );
}
