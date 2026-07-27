'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { CONTACT_REQUEST_STATUSES } from '@mta/shared';
import { adminListContacts, adminUpdateContactStatus } from '@/lib/api/endpoints';
import { useToken } from '@/lib/useToken';
import { AdminCard, AdminPageTitle } from '@/components/admin/ui';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/form';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner, Alert, EmptyState } from '@/components/ui/feedback';
import { formatDate } from '@/lib/utils';

export default function AdminContactRequestsPage() {
  const token = useToken();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['admin', 'contacts', { token, page }],
    queryFn: () => adminListContacts(token, page, 15),
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminUpdateContactStatus(token, id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] }),
  });

  return (
    <>
      <AdminPageTitle title="Contact Requests" description="General enquiries from the contact form." />

      {query.isLoading && (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}
      {query.isError && <Alert tone="error">Unable to load contact requests.</Alert>}

      {query.data && query.data.data.length === 0 && (
        <EmptyState title="No contact requests" description="New messages will appear here." />
      )}

      {query.data && query.data.data.length > 0 && (
        <AdminCard>
          <div className="space-y-4">
            {query.data.data.map((contact) => (
              <div key={contact.id} className="rounded-xl border border-navy-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy-900">{contact.fullName}</p>
                    <p className="text-sm text-navy-600">{contact.email}</p>
                    {contact.preferredContactMethod && contact.contactValue && (
                      <p className="text-sm text-navy-500">
                        {contact.preferredContactMethod}: {contact.contactValue}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="gray">{formatDate(contact.createdAt)}</Badge>
                    <Select
                      aria-label={`Status for ${contact.fullName}`}
                      value={contact.status}
                      onChange={(e) => mutation.mutate({ id: contact.id, status: e.target.value })}
                      className="w-auto py-1.5 text-sm"
                    >
                      {CONTACT_REQUEST_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                {contact.subject && (
                  <p className="mt-3 text-sm font-medium text-navy-800">Subject: {contact.subject}</p>
                )}
                <p className="mt-2 whitespace-pre-wrap text-sm text-navy-700">{contact.message}</p>
              </div>
            ))}
          </div>
          <Pagination pagination={query.data.pagination} onPageChange={setPage} />
        </AdminCard>
      )}
    </>
  );
}
