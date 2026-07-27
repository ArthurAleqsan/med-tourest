import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-navy-100/70 bg-white p-6 shadow-card',
        hover && 'transition-shadow hover:shadow-card-hover',
        className,
      )}
    >
      {children}
    </div>
  );
}
