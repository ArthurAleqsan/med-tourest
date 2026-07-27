'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SpecialtyDto, SpecialtyInput } from '@mta/shared';
import {
  adminCreateSpecialty,
  adminDeleteSpecialty,
  adminListSpecialties,
  adminUpdateSpecialty,
} from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle } from '@/components/admin/ui';
import { SpecialtyForm } from '@/components/admin/SpecialtyForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner, Alert, EmptyState } from '@/components/ui/feedback';

export default function AdminSpecialtiesPage() {
  const token = useToken();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<SpecialtyDto | null>(null);
  const [creating, setCreating] = useState(false);

  const query = useQuery({
    queryKey: ['admin', 'specialties', token],
    queryFn: () => adminListSpecialties(token),
    enabled: Boolean(token),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'specialties'] });
    queryClient.invalidateQueries({ queryKey: ['specialties'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: SpecialtyInput) => adminCreateSpecialty(token, payload),
    onSuccess: () => {
      invalidate();
      setCreating(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SpecialtyInput }) =>
      adminUpdateSpecialty(token, id, payload),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteSpecialty(token, id),
    onSuccess: invalidate,
  });

  const errFor = (m: { error: unknown; isError: boolean }) =>
    m.error instanceof ApiRequestError ? m.error.message : m.isError ? 'Something went wrong.' : null;

  return (
    <>
      <AdminPageTitle
        title="Specialties"
        description="Manage the medical specialties shown on the site."
        action={
          !creating && !editing ? (
            <Button onClick={() => setCreating(true)}>Add specialty</Button>
          ) : undefined
        }
      />

      {creating && (
        <AdminCard className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-navy-900">New specialty</h2>
          <SpecialtyForm
            submitting={createMutation.isPending}
            errorMessage={errFor(createMutation)}
            onSubmit={(payload) => createMutation.mutate(payload)}
            onCancel={() => setCreating(false)}
          />
        </AdminCard>
      )}

      {editing && (
        <AdminCard className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-navy-900">Edit: {editing.name}</h2>
          <SpecialtyForm
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
      {query.isError && <Alert tone="error">Unable to load specialties.</Alert>}
      {deleteMutation.isError && (
        <Alert tone="error" className="mb-4">
          {errFor(deleteMutation)}
        </Alert>
      )}

      {query.data && query.data.length === 0 && (
        <EmptyState title="No specialties yet" description="Add your first specialty." />
      )}

      {query.data && query.data.length > 0 && (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-navy-500">
                <tr>
                  <th className="py-2 pr-4">Order</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Doctors</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {query.data.map((specialty) => (
                  <tr key={specialty.id} className="hover:bg-navy-50/50">
                    <td className="py-2.5 pr-4">{specialty.displayOrder}</td>
                    <td className="py-2.5 pr-4 font-medium text-navy-900">{specialty.name}</td>
                    <td className="py-2.5 pr-4">{specialty.doctorCount ?? 0}</td>
                    <td className="py-2.5 pr-4">
                      <Badge tone={specialty.isActive ? 'green' : 'gray'}>
                        {specialty.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCreating(false);
                            setEditing(specialty);
                          }}
                          className="text-sm font-medium text-brand-700 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${specialty.name}"?`)) {
                              deleteMutation.mutate(specialty.id);
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
