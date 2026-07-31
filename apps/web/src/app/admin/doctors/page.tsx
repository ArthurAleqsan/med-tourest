'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { adminDeleteDoctor, adminListDoctors } from '@/lib/api/endpoints';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle } from '@/components/admin/ui';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { Input } from '@/components/ui/form';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner, Alert, EmptyState } from '@/components/ui/feedback';

export default function AdminDoctorsPage() {
  const token = useToken();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['admin', 'doctors', { token, search, page }],
    queryFn: () => adminListDoctors(token, { search: search || undefined, page, limit: 15 }),
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteDoctor(token, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] }),
  });

  return (
    <>
      <AdminPageTitle
        title="Doctors"
        description="Create and manage doctor profiles."
        action={<LinkButton href="/admin/doctors/new">Add doctor</LinkButton>}
      />

      <AdminCard className="mb-6">
        <Input
          type="search"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-sm"
        />
      </AdminCard>

      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}
      {query.isError && <Alert tone="error">Unable to load doctors.</Alert>}
      {deleteMutation.isError && <Alert tone="error" className="mb-4">Unable to delete doctor.</Alert>}

      {query.data && query.data.data.length === 0 && (
        <EmptyState title="No doctors found" description="Add your first doctor to get started." />
      )}

      {query.data && query.data.data.length > 0 && (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-navy-500">
                <tr>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Specialty</th>
                  <th className="py-2 pr-4">Centers</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {query.data.data.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-navy-50/50">
                    <td className="py-2.5 pr-4 font-medium text-navy-900">Dr. {doctor.fullName}</td>
                    <td className="py-2.5 pr-4">{doctor.specialty.en_name}</td>
                    <td className="py-2.5 pr-4">
                      {doctor.centers.map((c) => c.en_name).join(', ') || '—'}
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex gap-1.5">
                        {doctor.isFeatured && <Badge tone="amber">Featured</Badge>}
                        <Badge tone={doctor.isActive ? 'green' : 'gray'}>
                          {doctor.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/doctors/${doctor.id}/edit`}
                          className="text-sm font-medium text-brand-700 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete Dr. ${doctor.fullName}? This cannot be undone.`)) {
                              deleteMutation.mutate(doctor.id);
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
          <Pagination pagination={query.data.pagination} onPageChange={setPage} />
        </AdminCard>
      )}
    </>
  );
}
