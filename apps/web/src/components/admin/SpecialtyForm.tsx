'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SpecialtyDto, SpecialtyInput } from '@mta/shared';
import {
  arrayToLines,
  linesToArray,
  LOCALES,
  LOCALE_SECTION_LABELS,
  specialtyFormSchema,
  type SpecialtyFormValues,
} from '@/lib/adminForms';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';
import { LanguageSection } from '@/components/admin/ui';

function buildPayload(values: SpecialtyFormValues): SpecialtyInput {
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
    icon: values.icon || undefined,
    en_treatments: linesToArray(values.en_treatments ?? ''),
    ru_treatments: linesToArray(values.ru_treatments ?? ''),
    am_treatments: linesToArray(values.am_treatments ?? ''),
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

const emptyValues: SpecialtyFormValues = {
  en_name: '',
  ru_name: '',
  am_name: '',
  en_shortDescription: '',
  ru_shortDescription: '',
  am_shortDescription: '',
  en_description: '',
  ru_description: '',
  am_description: '',
  icon: '',
  en_treatments: '',
  ru_treatments: '',
  am_treatments: '',
  displayOrder: 0,
  isActive: true,
};

function toFormValues(initial: SpecialtyDto): SpecialtyFormValues {
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
    icon: initial.icon ?? '',
    en_treatments: arrayToLines(initial.en_treatments),
    ru_treatments: arrayToLines(initial.ru_treatments),
    am_treatments: arrayToLines(initial.am_treatments),
    displayOrder: initial.displayOrder,
    isActive: initial.isActive,
  };
}

export function SpecialtyForm({
  initial,
  submitting,
  errorMessage,
  onSubmit,
  onCancel,
}: {
  initial?: SpecialtyDto;
  submitting: boolean;
  errorMessage?: string | null;
  onSubmit: (payload: SpecialtyInput) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpecialtyFormValues>({
    resolver: zodResolver(specialtyFormSchema),
    values: initial ? toFormValues(initial) : emptyValues,
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(buildPayload(v)))}>
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      {LOCALES.map((lang) => (
        <LanguageSection key={lang} title={LOCALE_SECTION_LABELS[lang]}>
          <Field
            label={`Name (${lang.toUpperCase()})`}
            htmlFor={`s-name-${lang}`}
            required
            error={errors[`${lang}_name`]?.message}
          >
            <Input id={`s-name-${lang}`} {...register(`${lang}_name`)} />
          </Field>
          <Field
            label={`Short description (${lang.toUpperCase()})`}
            htmlFor={`s-short-${lang}`}
            required
            error={errors[`${lang}_shortDescription`]?.message}
          >
            <Textarea id={`s-short-${lang}`} rows={2} {...register(`${lang}_shortDescription`)} />
          </Field>
          <Field
            label={`Description (${lang.toUpperCase()})`}
            htmlFor={`s-desc-${lang}`}
            required
            error={errors[`${lang}_description`]?.message}
          >
            <Textarea id={`s-desc-${lang}`} rows={4} {...register(`${lang}_description`)} />
          </Field>
          <Field label={`Treatments (${lang.toUpperCase()}, one per line)`} htmlFor={`s-treatments-${lang}`}>
            <Textarea id={`s-treatments-${lang}`} rows={3} {...register(`${lang}_treatments`)} />
          </Field>
        </LanguageSection>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Icon key" htmlFor="s-icon" hint="e.g. heart, tooth, brain">
          <Input id="s-icon" {...register('icon')} />
        </Field>
        <Field label="Display order" htmlFor="s-order" error={errors.displayOrder?.message}>
          <Input id="s-order" type="number" min={0} {...register('displayOrder')} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-navy-800">
        <input type="checkbox" className="h-4 w-4" {...register('isActive')} />
        Active (visible publicly)
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save specialty'}
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
