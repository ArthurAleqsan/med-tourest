'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import type { DoctorInput } from '@mta/shared';
import { adminCreateDoctor } from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle } from '@/components/admin/ui';
import { DoctorForm } from '@/components/admin/DoctorForm';

export default function NewDoctorPage() {
  const token = useToken();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: DoctorInput) => adminCreateDoctor(token, payload),
    onSuccess: () => router.push('/admin/doctors'),
  });

  const errorMessage =
    mutation.error instanceof ApiRequestError
      ? mutation.error.fieldErrors?.map((e) => e.message).join(' ') ?? mutation.error.message
      : mutation.isError
        ? 'Unable to create doctor.'
        : null;

  return (
    <>
      <AdminPageTitle title="Add doctor" />
      <AdminCard>
        <DoctorForm
          submitting={mutation.isPending}
          errorMessage={errorMessage}
          onSubmit={(payload) => mutation.mutate(payload)}
        />
      </AdminCard>
    </>
  );
}
