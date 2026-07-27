/**
 * Plural message forms. English/Armenian use `one`/`other`; Russian additionally
 * uses `few`/`many`. `other` is always required as the fallback.
 */
export interface PluralForms {
  one?: string;
  few?: string;
  many?: string;
  other: string;
}

/**
 * Identity helper so that plural entries in the message dictionaries are inferred
 * as `PluralForms` (allowing optional `few`/`many`) rather than as narrow object
 * literals. This lets every locale share one `Messages` type.
 */
export const pf = (forms: PluralForms): PluralForms => forms;
