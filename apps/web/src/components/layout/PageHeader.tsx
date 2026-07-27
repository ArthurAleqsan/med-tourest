import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-navy-100 bg-gradient-to-b from-brand-50/60 to-white">
      <Container className="py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-lg text-navy-600/80">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </Container>
    </div>
  );
}
