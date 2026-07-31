'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MedicalCenterDto, MedicalCenterInput } from '@mta/shared';
import {
  LOCALES,
  LOCALE_SECTION_LABELS,
  centerFormSchema,
  type CenterFormValues,
} from '@/lib/adminForms';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';
import { LanguageSection } from '@/components/admin/ui';

function buildPayload(values: CenterFormValues): MedicalCenterInput {
  return {
    en_name: values.en_name,
    ru_name: values.ru_name,
    am_name: values.am_name,
    en_shortDescription: values.en_shortDescription,
    ru_shortDescription: values.ru_shortDescription,
    am_shortDescription: values.am_shortDescription,
    en_description: values.en_description,
    ru_description: values.ru_description,
    am_description: values.am_description,
    en_address: values.en_address,
    ru_address: values.ru_address,
    am_address: values.am_address,
    en_city: values.en_city,
    ru_city: values.ru_city,
    am_city: values.am_city,
    phone: values.phone || undefined,
    email: values.email || undefined,
    website: values.website || undefined,
    photoUrl: values.photoUrl || undefined,
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

const emptyValues: CenterFormValues = {
  en_name: '',
  ru_name: '',
  am_name: '',
  en_shortDescription: '',
  ru_shortDescription: '',
  am_shortDescription: '',
  en_description: '',
  ru_description: '',
  am_description: '',
  en_address: '',
  ru_address: '',
  am_address: '',
  en_city: '',
  ru_city: '',
  am_city: '',
  phone: '',
  email: '',
  website: '',
  photoUrl: '',
  displayOrder: 0,
  isActive: true,
};

function toFormValues(initial: MedicalCenterDto): CenterFormValues {
  return {
    en_name: initial.en_name,
    ru_name: initial.ru_name,
    am_name: initial.am_name,
    en_shortDescription: initial.en_shortDescription,
    ru_shortDescription: initial.ru_shortDescription,
    am_shortDescription: initial.am_shortDescription,
    en_description: initial.en_description,
    ru_description: initial.ru_description,
    am_description: initial.am_description,
    en_address: initial.en_address,
    ru_address: initial.ru_address,
    am_address: initial.am_address,
    en_city: initial.en_city,
    ru_city: initial.ru_city,
    am_city: initial.am_city,
    phone: initial.phone ?? '',
    email: initial.email ?? '',
    website: initial.website ?? '',
    photoUrl: initial.photoUrl ?? '',
    displayOrder: initial.displayOrder,
    isActive: initial.isActive,
  };
}

export function CenterForm({
  initial,
  submitting,
  errorMessage,
  onSubmit,
  onCancel,
}: {
  initial?: MedicalCenterDto;
  submitting: boolean;
  errorMessage?: string | null;
  onSubmit: (payload: MedicalCenterInput) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CenterFormValues>({
    resolver: zodResolver(centerFormSchema),
    values: initial ? toFormValues(initial) : emptyValues,
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(buildPayload(v)))}>
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      {LOCALES.map((lang) => (
        <LanguageSection key={lang} title={LOCALE_SECTION_LABELS[lang]}>
          <Field
            label={`Name (${lang.toUpperCase()})`}
            htmlFor={`c-name-${lang}`}
            required
            error={errors[`${lang}_name`]?.message}
          >
            <Input id={`c-name-${lang}`} {...register(`${lang}_name`)} />
          </Field>
          <Field
            label={`Short description (${lang.toUpperCase()})`}
            htmlFor={`c-short-${lang}`}
            required
            error={errors[`${lang}_shortDescription`]?.message}
          >
            <Textarea id={`c-short-${lang}`} rows={2} {...register(`${lang}_shortDescription`)} />
          </Field>
          <Field
            label={`Description (${lang.toUpperCase()})`}
            htmlFor={`c-desc-${lang}`}
            required
            error={errors[`${lang}_description`]?.message}
          >
            <Textarea id={`c-desc-${lang}`} rows={4} {...register(`${lang}_description`)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={`Address (${lang.toUpperCase()})`}
              htmlFor={`c-address-${lang}`}
              required
              error={errors[`${lang}_address`]?.message}
            >
              <Input id={`c-address-${lang}`} {...register(`${lang}_address`)} />
            </Field>
            <Field
              label={`City (${lang.toUpperCase()})`}
              htmlFor={`c-city-${lang}`}
              required
              error={errors[`${lang}_city`]?.message}
            >
              <Input id={`c-city-${lang}`} {...register(`${lang}_city`)} />
            </Field>
          </div>
        </LanguageSection>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" htmlFor="c-phone" error={errors.phone?.message}>
          <Input id="c-phone" {...register('phone')} />
        </Field>
        <Field label="Email" htmlFor="c-email" error={errors.email?.message}>
          <Input id="c-email" {...register('email')} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Website" htmlFor="c-website" error={errors.website?.message}>
          <Input id="c-website" placeholder="https://..." {...register('website')} />
        </Field>
        <Field label="Photo URL" htmlFor="c-photo" error={errors.photoUrl?.message}>
          <Input id="c-photo" placeholder="https://..." {...register('photoUrl')} />
        </Field>
      </div>
      <Field label="Display order" htmlFor="c-order" error={errors.displayOrder?.message}>
        <Input id="c-order" type="number" min={0} {...register('displayOrder')} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-navy-800">
        <input type="checkbox" className="h-4 w-4" {...register('isActive')} />
        Active (visible publicly)
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save center'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
