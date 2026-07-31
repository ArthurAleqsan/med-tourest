'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MedicalCenterDto, MedicalCenterInput } from '@mta/shared';
import {
  adminCreateCenter,
  adminDeleteCenter,
  adminListCenters,
  adminUpdateCenter,
} from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle } from '@/components/admin/ui';
import { CenterForm } from '@/components/admin/CenterForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner, Alert, EmptyState } from '@/components/ui/feedback';

export default function AdminCentersPage() {
  const token = useToken();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<MedicalCenterDto | null>(null);
  const [creating, setCreating] = useState(false);

  const query = useQuery({
    queryKey: ['admin', 'centers', token],
    queryFn: () => adminListCenters(token),
    enabled: Boolean(token),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'centers'] });
    queryClient.invalidateQueries({ queryKey: ['centers'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: MedicalCenterInput) => adminCreateCenter(token, payload),
    onSuccess: () => {
      invalidate();
      setCreating(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MedicalCenterInput }) =>
      adminUpdateCenter(token, id, payload),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteCenter(token, id),
    onSuccess: invalidate,
  });

  const errFor = (m: { error: unknown; isError: boolean }) =>
    m.error instanceof ApiRequestError ? m.error.message : m.isError ? 'Something went wrong.' : null;

  return (
    <>
      <AdminPageTitle
        title="Medical Centers"
        description="Manage the hospitals and clinics shown on the site."
        action={
          !creating && !editing ? (
            <Button onClick={() => setCreating(true)}>Add center</Button>
          ) : undefined
        }
      />

      {creating && (
        <AdminCard className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-navy-900">New medical center</h2>
          <CenterForm
            submitting={createMutation.isPending}
            errorMessage={errFor(createMutation)}
            onSubmit={(payload) => createMutation.mutate(payload)}
            onCancel={() => setCreating(false)}
          />
        </AdminCard>
      )}

      {editing && (
        <AdminCard className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-navy-900">Edit: {editing.en_name}</h2>
          <CenterForm
            initial={editing}
            submitting={updateMutation.isPending}
            errorMessage={errFor(updateMutation)}
            onSubmit={(payload) => updateMutation.mutate({ id: editing.id, payload })}
            onCancel={() => setEditing(null)}
          />
        </AdminCard>
      )}

      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}
      {query.isError && <Alert tone="error">Unable to load medical centers.</Alert>}
      {deleteMutation.isError && (
        <Alert tone="error" className="mb-4">
          {errFor(deleteMutation)}
        </Alert>
      )}

      {query.data && query.data.length === 0 && (
        <EmptyState title="No medical centers yet" description="Add your first center." />
      )}

      {query.data && query.data.length > 0 && (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-navy-500">
                <tr>
                  <th className="py-2 pr-4">Order</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">City</th>
                  <th className="py-2 pr-4">Doctors</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {query.data.map((center) => (
                  <tr key={center.id} className="hover:bg-navy-50/50">
                    <td className="py-2.5 pr-4">{center.displayOrder}</td>
                    <td className="py-2.5 pr-4 font-medium text-navy-900">{center.en_name}</td>
                    <td className="py-2.5 pr-4">{center.en_city}</td>
                    <td className="py-2.5 pr-4">{center.doctorCount ?? 0}</td>
                    <td className="py-2.5 pr-4">
                      <Badge tone={center.isActive ? 'green' : 'gray'}>
                        {center.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCreating(false);
                            setEditing(center);
                          }}
                          className="text-sm font-medium text-brand-700 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${center.en_name}"?`)) {
                              deleteMutation.mutate(center.id);
                            }
                          }}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </>
  );
}
