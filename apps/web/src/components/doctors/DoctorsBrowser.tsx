'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCenters, getDoctors, getSpecialties } from '@/lib/api/endpoints';
import { DoctorCardClient } from '@/components/doctors/DoctorCardClient';
import { DoctorCardSkeleton } from '@/components/doctors/DoctorCardSkeleton';
import { Pagination } from '@/components/ui/Pagination';
import { Field, Input, Select } from '@/components/ui/form';
import { Alert, EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/Button';
import { LANGUAGES, translateLanguage } from '@/lib/languages';
import { useI18n } from '@/i18n/client';
import { useLocalized } from '@/lib/useLocalized';

const SORT_VALUES = ['experience_desc', 'experience_asc', 'name_asc', 'name_desc'] as const;

export function DoctorsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { m, plural } = useI18n();
  const { loc } = useLocalized();

  const specialty = searchParams.get('specialty') ?? '';
  const language = searchParams.get('language') ?? '';
  const center = searchParams.get('center') ?? '';
  const sort = searchParams.get('sort') ?? 'experience_desc';
  const search = searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const [searchInput, setSearchInput] = useState(search);

  // Keep the local search box in sync when the URL changes externally.
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateParams = useCallback(
    (updates: Record<string, string | number | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') params.delete(key);
        else params.set(key, String(value));
      });
      if (resetPage && !('page' in updates)) params.delete('page');
      router.replace(`/doctors?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Debounce search input into the URL.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== search) updateParams({ search: searchInput });
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput, search, updateParams]);

  const specialtiesQuery = useQuery({
    queryKey: ['specialties'],
    queryFn: () => getSpecialties(),
  });

  const centersQuery = useQuery({
    queryKey: ['centers'],
    queryFn: () => getCenters(),
  });

  const doctorsQuery = useQuery({
    queryKey: ['doctors', { specialty, language, center, sort, search, page }],
    queryFn: () =>
      getDoctors({
        specialty: specialty || undefined,
        language: language || undefined,
        center: center || undefined,
        sort,
        search: search || undefined,
        page,
        limit: 9,
      }),
    placeholderData: keepPreviousData,
  });

  const hasActiveFilters = useMemo(
    () => Boolean(specialty || language || center || search),
    [specialty, language, center, search],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="space-y-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-800">
              {m.doctors.filters}
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => router.replace('/doctors', { scroll: false })}
                className="text-xs font-medium text-brand-700 hover:underline"
              >
                {m.common.clearAll}
              </button>
            )}
          </div>

          <Field label={m.doctors.searchLabel} htmlFor="search">
            <Input
              id="search"
              type="search"
              placeholder={m.doctors.searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Field>

          <Field label={m.doctors.specialtyLabel} htmlFor="specialty">
            <Select
              id="specialty"
              value={specialty}
              onChange={(e) => updateParams({ specialty: e.target.value })}
            >
              <option value="">{m.doctors.allSpecialties}</option>
              {specialtiesQuery.data?.map((s) => (
                <option key={s.id} value={s.slug}>
                  {loc(s, 'name')}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={m.doctors.languageLabel} htmlFor="language">
            <Select
              id="language"
              value={language}
              onChange={(e) => updateParams({ language: e.target.value })}
            >
              <option value="">{m.doctors.anyLanguage}</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {translateLanguage(m, lang)}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={m.doctors.centerLabel} htmlFor="center">
            <Select
              id="center"
              value={center}
              onChange={(e) => updateParams({ center: e.target.value })}
            >
              <option value="">{m.doctors.allCenters}</option>
              {centersQuery.data?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {loc(c, 'name')}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-navy-600" aria-live="polite">
            {doctorsQuery.data
              ? plural(doctorsQuery.data.pagination.totalItems, m.doctors.resultsFound)
              : m.doctors.loadingResults}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-navy-600">
              {m.doctors.sortLabel}
            </label>
            <Select
              id="sort"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="w-auto"
            >
              {SORT_VALUES.map((value) => (
                <option key={value} value={value}>
                  {m.doctors.sort[value]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {doctorsQuery.isError && (
          <Alert tone="error" title={m.doctors.errorTitle}>
            {m.doctors.errorBody}
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={() => doctorsQuery.refetch()}>
                {m.common.retry}
              </Button>
            </div>
          </Alert>
        )}

        {doctorsQuery.isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        )}

        {doctorsQuery.data && doctorsQuery.data.data.length === 0 && (
          <EmptyState
            title={m.doctors.emptyTitle}
            description={m.doctors.emptyDescription}
            action={
              <Button variant="outline" onClick={() => router.replace('/doctors', { scroll: false })}>
                {m.doctors.clearFilters}
              </Button>
            }
          />
        )}

        {doctorsQuery.data && doctorsQuery.data.data.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {doctorsQuery.data.data.map((doctor) => (
                <DoctorCardClient key={doctor.id} doctor={doctor} />
              ))}
            </div>
            <Pagination
              pagination={doctorsQuery.data.pagination}
              onPageChange={(p) => updateParams({ page: p }, false)}
            />
          </>
        )}
      </div>
    </div>
  );
}
