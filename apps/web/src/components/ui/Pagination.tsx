'use client';

import type { PaginationMeta } from '@mta/shared';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/client';

export function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  const { m } = useI18n();
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav aria-label={m.common.pagination} className="mt-10 flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!pagination.hasPreviousPage}
        className="rounded-lg border border-navy-100 px-3 py-2 text-sm font-medium text-navy-700 disabled:opacity-40 hover:bg-navy-50"
      >
        {m.common.previous}
      </button>
      {pages.map((p, index) => {
        const prev = pages[index - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {gap && <span className="px-1 text-navy-400">…</span>}
            <button
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPageChange(p)}
              className={cn(
                'min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium',
                p === page
                  ? 'bg-brand-600 text-white'
                  : 'border border-navy-100 text-navy-700 hover:bg-navy-50',
              )}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!pagination.hasNextPage}
        className="rounded-lg border border-navy-100 px-3 py-2 text-sm font-medium text-navy-700 disabled:opacity-40 hover:bg-navy-50"
      >
        {m.common.next}
      </button>
    </nav>
  );
}
