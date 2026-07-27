import type { Locale } from '../config';
import { en, type Messages } from './en';
import { hy } from './hy';
import { ru } from './ru';

const dictionaries: Record<Locale, Messages> = { en, hy, ru };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export type { Messages };
