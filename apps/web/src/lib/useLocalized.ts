'use client';

import { useI18n } from '@/i18n/client';
import { loc, locArray } from '@/lib/localized';

/** Client hook: localized field pickers bound to the active UI locale. */
export function useLocalized() {
  const { locale } = useI18n();
  return {
    locale,
    loc: (record: object, field: string) => loc(record, field, locale),
    locArray: (record: object, field: string) => locArray(record, field, locale),
  };
}
