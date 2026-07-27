import type { AppointmentSubmissionResult } from '@mta/shared';
import { Card } from '@/components/ui/Card';
import { Button, LinkButton } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { useI18n } from '@/i18n/client';

export function AppointmentSuccess({
  result,
  onReset,
}: {
  result: AppointmentSubmissionResult;
  onReset: () => void;
}) {
  const { m, locale } = useI18n();

  return (
    <Card className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">
        ✓
      </div>
      <h2 className="mt-5 text-2xl font-bold text-navy-900">{m.appointmentSuccess.title}</h2>
      <p className="mt-2 text-navy-600">{m.appointmentSuccess.subtitle}</p>

      <div className="mx-auto mt-6 max-w-sm rounded-xl bg-navy-50 p-5">
        <p className="text-sm text-navy-600">{m.appointmentSuccess.referenceLabel}</p>
        <p className="mt-1 text-2xl font-bold tracking-wide text-brand-700">
          {result.referenceNumber}
        </p>
        <dl className="mt-4 space-y-1 text-left text-sm text-navy-700">
          <div className="flex justify-between">
            <dt className="text-navy-500">{m.appointmentSuccess.preferredDate}</dt>
            <dd className="font-medium">{result.preferredDate}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-navy-500">{m.appointmentSuccess.timePeriod}</dt>
            <dd className="font-medium">{m.timePeriods[result.preferredTimePeriod]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-navy-500">{m.appointmentSuccess.submitted}</dt>
            <dd className="font-medium">{formatDate(result.createdAt, locale)}</dd>
          </div>
        </dl>
      </div>

      <div className="mx-auto mt-6 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-900">
        <p className="font-semibold">{m.appointmentSuccess.notConfirmedTitle}</p>
        <p className="mt-1">{m.appointmentSuccess.notConfirmedBody}</p>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <LinkButton href="/doctors" variant="outline">
          {m.appointmentSuccess.browseMore}
        </LinkButton>
        <Button variant="ghost" onClick={onReset}>
          {m.appointmentSuccess.submitAnother}
        </Button>
      </div>
    </Card>
  );
}
