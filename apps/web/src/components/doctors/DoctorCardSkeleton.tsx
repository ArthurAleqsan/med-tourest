import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/feedback';

export function DoctorCardSkeleton() {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
          <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 flex-1 rounded-xl" />
      </div>
    </Card>
  );
}
