import type { ReactNode } from 'react';
import type { AppointmentStatus } from '@mta/shared';
import { APPOINTMENT_STATUS_LABELS } from '@mta/shared';
import { Badge } from '@/components/ui/Badge';

export function AdminPageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-navy-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}

const STATUS_TONES: Record<AppointmentStatus, Parameters<typeof Badge>[0]['tone']> = {
  new: 'brand',
  contacted: 'turquoise',
  pending_confirmation: 'amber',
  confirmed: 'green',
  cancelled: 'red',
  completed: 'gray',
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge tone={STATUS_TONES[status]}>{APPOINTMENT_STATUS_LABELS[status]}</Badge>;
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-navy-100 bg-white p-5 shadow-sm ${className ?? ''}`}>
      {children}
    </div>
  );
}

export function LanguageSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-lg border border-navy-200 p-4">
      <legend className="px-1 text-sm font-semibold text-navy-900">{title}</legend>
      {children}
    </fieldset>
  );
}
