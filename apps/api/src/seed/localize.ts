/** Expand a single English string into en/ru/am fields (seed placeholder translations). */
export function L(field: string, en: string): Record<string, string> {
  return {
    [`en_${field}`]: en,
    [`ru_${field}`]: en,
    [`am_${field}`]: en,
  };
}

/** Expand a string array into en/ru/am array fields. */
export function LA(field: string, en: string[]): Record<string, string[]> {
  return {
    [`en_${field}`]: en,
    [`ru_${field}`]: en,
    [`am_${field}`]: en,
  };
}
