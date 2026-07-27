import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  muted?: boolean;
}

export function Section({ children, className, id, muted = false }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 sm:py-20', muted && 'bg-navy-50/60', className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn('mb-12 max-w-2xl', centered && 'mx-auto text-center')}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-turquoise-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg text-navy-600/80">{description}</p>}
    </div>
  );
}
