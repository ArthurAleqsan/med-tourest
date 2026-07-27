import type { PaginatedData, PaginationMeta } from '@mta/shared';

export function buildPaginationMeta(
  page: number,
  limit: number,
  totalItems: number,
): PaginationMeta {
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && totalItems > 0,
  };
}

export function paginated<T>(
  items: T[],
  page: number,
  limit: number,
  totalItems: number,
): PaginatedData<T> {
  return { data: items, pagination: buildPaginationMeta(page, limit, totalItems) };
}
