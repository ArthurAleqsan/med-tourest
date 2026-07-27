import { z } from 'zod';
import {
  CONTACT_METHODS,
  FIELD_LIMITS,
  PREFERRED_TIME_PERIODS,
  getAppointmentDateRange,
  isValidDateOnly,
} from '@mta/shared';
import type { Messages } from '@/i18n/messages';

const telegramRegex = /^@?[A-Za-z0-9_]{4,32}$/;
const phoneRegex = /^\+?[1-9]\d{6,14}$/;

type ValidationMessages = Messages['validation'];

/**
 * Client-side form schema factory. It mirrors the backend contract but uses
 * form-friendly input types and localized messages. The backend re-validates
 * with the shared schema, and the preferred-date range check reuses shared logic.
 */
export function createAppointmentFormSchema(v: ValidationMessages) {
  return z
    .object({
      doctorId: z.string().optional(),
      specialtyId: z.string().min(1, v.specialtyRequired),
      preferredDate: z
        .string()
        .min(1, v.preferredDateRequired)
        .superRefine((value, ctx) => {
          if (!isValidDateOnly(value)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: v.preferredDateInvalid });
            return;
          }
          const range = getAppointmentDateRange();
          if (value < range.min) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: v.preferredDatePast });
          } else if (value > range.max) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: v.preferredDateTooFar });
          }
        }),
      preferredTimePeriod: z.enum(PREFERRED_TIME_PERIODS),
      firstName: z.string().min(1, v.firstNameRequired).max(FIELD_LIMITS.firstName.max),
      lastName: z.string().min(1, v.lastNameRequired).max(FIELD_LIMITS.lastName.max),
      email: z.string().min(1, v.emailRequired).email(v.emailInvalid),
      country: z.string().min(2, v.countryRequired).max(FIELD_LIMITS.country.max),
      phoneNumber: z.string().max(FIELD_LIMITS.phoneNumber.max).optional(),
      preferredContactMethod: z.enum(CONTACT_METHODS, {
        errorMap: () => ({ message: v.contactMethodRequired }),
      }),
      contactValue: z.string().min(1, v.contactValueRequired).max(FIELD_LIMITS.contactValue.max),
      message: z.string().max(FIELD_LIMITS.message.max).optional(),
      medicalInformation: z.string().max(FIELD_LIMITS.medicalInformation.max).optional(),
      consentAccepted: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (!data.consentAccepted) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['consentAccepted'],
          message: v.consentRequired,
        });
      }
      if (data.preferredContactMethod === 'telegram' && !telegramRegex.test(data.contactValue)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contactValue'],
          message: v.telegramInvalid,
        });
      }
      if (data.preferredContactMethod === 'whatsapp' && !phoneRegex.test(data.contactValue)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contactValue'],
          message: v.whatsappInvalid,
        });
      }
    });
}

export type AppointmentFormValues = z.infer<ReturnType<typeof createAppointmentFormSchema>>;
