import { z } from 'zod';
import { CONTACT_METHODS, FIELD_LIMITS } from '@mta/shared';
import type { Messages } from '@/i18n/messages';

type ValidationMessages = Messages['validation'];

export function createContactFormSchema(v: ValidationMessages) {
  return z.object({
    fullName: z.string().min(2, v.nameRequired).max(FIELD_LIMITS.fullName.max),
    email: z.string().min(1, v.emailRequired).email(v.emailInvalid),
    preferredContactMethod: z.union([z.enum(CONTACT_METHODS), z.literal('')]).optional(),
    contactValue: z.string().max(FIELD_LIMITS.contactValue.max).optional(),
    subject: z.string().max(FIELD_LIMITS.subject.max).optional(),
    message: z.string().min(1, v.messageRequired).max(FIELD_LIMITS.contactMessage.max),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>;
