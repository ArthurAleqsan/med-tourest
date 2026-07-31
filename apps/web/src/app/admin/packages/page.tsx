'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PackageDto, PackageInput } from '@mta/shared';
import {
  adminCreatePackage,
  adminDeletePackage,
  adminListPackages,
  adminUpdatePackage,
} from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle } from '@/components/admin/ui';
import { PackageForm } from '@/components/admin/PackageForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner, Alert, EmptyState } from '@/components/ui/feedback';

export default function AdminPackagesPage() {
  const token = useToken();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PackageDto | null>(null);
  const [creating, setCreating] = useState(false);

  const query = useQuery({
    queryKey: ['admin', 'packages', token],
    queryFn: () => adminListPackages(token),
    enabled: Boolean(token),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'packages'] });
    queryClient.invalidateQueries({ queryKey: ['packages'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: PackageInput) => adminCreatePackage(token, payload),
    onSuccess: () => {
      invalidate();
      setCreating(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PackageInput }) =>
      adminUpdatePackage(token, id, payload),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeletePackage(token, id),
    onSuccess: invalidate,
  });

  const errFor = (m: { error: unknown; isError: boolean }) =>
    m.error instanceof ApiRequestError ? m.error.message : m.isError ? 'Something went wrong.' : null;

  return (
    <>
      <AdminPageTitle
        title="Packages"
        description="Manage treatment + travel packages (hotel, tours, duration)."
        action={
          !creating && !editing ? (
            <Button onClick={() => setCreating(true)}>Add package</Button>
          ) : undefined
        }
      />

      {creating && (
        <AdminCard className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-navy-900">New package</h2>
          <PackageForm
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
          <PackageForm
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
      {query.isError && <Alert tone="error">Unable to load packages.</Alert>}
      {deleteMutation.isError && (
        <Alert tone="error" className="mb-4">
          {errFor(deleteMutation)}
        </Alert>
      )}

      {query.data && query.data.length === 0 && (
        <EmptyState title="No packages yet" description="Add your first travel package." />
      )}

      {query.data && query.data.length > 0 && (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-navy-500">
                <tr>
                  <th className="py-2 pr-4">Order</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Duration</th>
                  <th className="py-2 pr-4">Hotel</th>
                  <th className="py-2 pr-4">Tours</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {query.data.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-navy-50/50">
                    <td className="py-2.5 pr-4">{pkg.displayOrder}</td>
                    <td className="py-2.5 pr-4 font-medium text-navy-900">{pkg.en_name}</td>
                    <td className="py-2.5 pr-4">{pkg.durationDays} days</td>
                    <td className="py-2.5 pr-4">{pkg.hotel.en_name}</td>
                    <td className="py-2.5 pr-4">{pkg.tours.length}</td>
                    <td className="py-2.5 pr-4">
                      <Badge tone={pkg.isActive ? 'green' : 'gray'}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCreating(false);
                            setEditing(pkg);
                          }}
                          className="text-sm font-medium text-brand-700 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${pkg.en_name}"?`)) {
                              deleteMutation.mutate(pkg.id);
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
