'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PackageDto, PackageInput } from '@mta/shared';
import {
  arrayToLines,
  linesToArray,
  LOCALES,
  LOCALE_SECTION_LABELS,
  packageFormSchema,
  type PackageFormValues,
} from '@/lib/adminForms';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';
import { LanguageSection } from '@/components/admin/ui';

const emptyTour = () => ({
  en_title: '',
  ru_title: '',
  am_title: '',
  en_description: '',
  ru_description: '',
  am_description: '',
});

function buildPayload(values: PackageFormValues): PackageInput {
  const stars =
    values.hotelStars === '' || values.hotelStars === undefined
      ? undefined
      : Number(values.hotelStars);
  const nights =
    values.hotelNights === '' || values.hotelNights === undefined
      ? undefined
      : Number(values.hotelNights);
  const priceFrom =
    values.priceFrom === '' || values.priceFrom === undefined
      ? undefined
      : Number(values.priceFrom);

  return {
    en_name: values.en_name,
    ru_name: values.ru_name,
    am_name: values.am_name,
    durationDays: values.durationDays,
    en_shortDescription: values.en_shortDescription,
    ru_shortDescription: values.ru_shortDescription,
    am_shortDescription: values.am_shortDescription,
    en_description: values.en_description,
    ru_description: values.ru_description,
    am_description: values.am_description,
    hotel: {
      en_name: values.en_hotelName,
      ru_name: values.ru_hotelName,
      am_name: values.am_hotelName,
      stars,
      en_roomType: values.en_hotelRoomType || undefined,
      ru_roomType: values.ru_hotelRoomType || undefined,
      am_roomType: values.am_hotelRoomType || undefined,
      nights,
      en_description: values.en_hotelDescription || undefined,
      ru_description: values.ru_hotelDescription || undefined,
      am_description: values.am_hotelDescription || undefined,
    },
    tours: values.tours.map((tour) => ({
      en_title: tour.en_title,
      ru_title: tour.ru_title,
      am_title: tour.am_title,
      en_description: tour.en_description,
      ru_description: tour.ru_description,
      am_description: tour.am_description,
    })),
    en_inclusions: linesToArray(values.en_inclusions ?? ''),
    ru_inclusions: linesToArray(values.ru_inclusions ?? ''),
    am_inclusions: linesToArray(values.am_inclusions ?? ''),
    priceFrom,
    currency: values.currency?.trim() ? values.currency.trim().toUpperCase() : undefined,
    photoUrl: values.photoUrl || undefined,
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

const emptyValues: PackageFormValues = {
  en_name: '',
  ru_name: '',
  am_name: '',
  durationDays: 10,
  en_shortDescription: '',
  ru_shortDescription: '',
  am_shortDescription: '',
  en_description: '',
  ru_description: '',
  am_description: '',
  en_hotelName: '',
  ru_hotelName: '',
  am_hotelName: '',
  hotelStars: '',
  en_hotelRoomType: '',
  ru_hotelRoomType: '',
  am_hotelRoomType: '',
  hotelNights: '',
  en_hotelDescription: '',
  ru_hotelDescription: '',
  am_hotelDescription: '',
  tours: [emptyTour()],
  en_inclusions: '',
  ru_inclusions: '',
  am_inclusions: '',
  priceFrom: '',
  currency: 'USD',
  photoUrl: '',
  displayOrder: 0,
  isActive: true,
};

function toFormValues(initial: PackageDto): PackageFormValues {
  return {
    en_name: initial.en_name,
    ru_name: initial.ru_name,
    am_name: initial.am_name,
    durationDays: initial.durationDays,
    en_shortDescription: initial.en_shortDescription,
    ru_shortDescription: initial.ru_shortDescription,
    am_shortDescription: initial.am_shortDescription,
    en_description: initial.en_description,
    ru_description: initial.ru_description,
    am_description: initial.am_description,
    en_hotelName: initial.hotel.en_name,
    ru_hotelName: initial.hotel.ru_name,
    am_hotelName: initial.hotel.am_name,
    hotelStars: initial.hotel.stars ?? '',
    en_hotelRoomType: initial.hotel.en_roomType ?? '',
    ru_hotelRoomType: initial.hotel.ru_roomType ?? '',
    am_hotelRoomType: initial.hotel.am_roomType ?? '',
    hotelNights: initial.hotel.nights ?? '',
    en_hotelDescription: initial.hotel.en_description ?? '',
    ru_hotelDescription: initial.hotel.ru_description ?? '',
    am_hotelDescription: initial.hotel.am_description ?? '',
    tours: initial.tours.length ? initial.tours : [emptyTour()],
    en_inclusions: arrayToLines(initial.en_inclusions),
    ru_inclusions: arrayToLines(initial.ru_inclusions),
    am_inclusions: arrayToLines(initial.am_inclusions),
    priceFrom: initial.priceFrom ?? '',
    currency: initial.currency ?? 'USD',
    photoUrl: initial.photoUrl ?? '',
    displayOrder: initial.displayOrder,
    isActive: initial.isActive,
  };
}

export function PackageForm({
  initial,
  submitting,
  errorMessage,
  onSubmit,
  onCancel,
}: {
  initial?: PackageDto;
  submitting: boolean;
  errorMessage?: string | null;
  onSubmit: (payload: PackageInput) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    values: initial ? toFormValues(initial) : emptyValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'tours' });

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(buildPayload(v)))}>
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      {LOCALES.map((lang) => (
        <LanguageSection key={lang} title={LOCALE_SECTION_LABELS[lang]}>
          <Field
            label={`Name (${lang.toUpperCase()})`}
            htmlFor={`p-name-${lang}`}
            required
            error={errors[`${lang}_name`]?.message}
          >
            <Input id={`p-name-${lang}`} {...register(`${lang}_name`)} />
          </Field>
          <Field
            label={`Short description (${lang.toUpperCase()})`}
            htmlFor={`p-short-${lang}`}
            required
            error={errors[`${lang}_shortDescription`]?.message}
          >
            <Textarea id={`p-short-${lang}`} rows={2} {...register(`${lang}_shortDescription`)} />
          </Field>
          <Field
            label={`Description (${lang.toUpperCase()})`}
            htmlFor={`p-desc-${lang}`}
            required
            error={errors[`${lang}_description`]?.message}
          >
            <Textarea id={`p-desc-${lang}`} rows={4} {...register(`${lang}_description`)} />
          </Field>
          <Field
            label={`Inclusions (${lang.toUpperCase()}, one per line)`}
            htmlFor={`p-inclusions-${lang}`}
            error={errors[`${lang}_inclusions`]?.message}
          >
            <Textarea id={`p-inclusions-${lang}`} rows={4} {...register(`${lang}_inclusions`)} />
          </Field>
        </LanguageSection>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Duration (days)"
          htmlFor="p-duration"
          required
          error={errors.durationDays?.message}
        >
          <Input id="p-duration" type="number" min={1} max={90} {...register('durationDays')} />
        </Field>
        <Field label="Display order" htmlFor="p-order" error={errors.displayOrder?.message}>
          <Input id="p-order" type="number" min={0} {...register('displayOrder')} />
        </Field>
      </div>

      <fieldset className="space-y-3 rounded-lg border border-navy-200 p-4">
        <legend className="px-1 text-sm font-semibold text-navy-900">Hotel information</legend>
        {LOCALES.map((lang) => (
          <div key={lang} className="space-y-3 rounded-md bg-navy-50/60 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-navy-500">
              {LOCALE_SECTION_LABELS[lang]}
            </p>
            <Field
              label={`Hotel name (${lang.toUpperCase()})`}
              htmlFor={`p-hotel-name-${lang}`}
              required
              error={errors[`${lang}_hotelName`]?.message}
            >
              <Input id={`p-hotel-name-${lang}`} {...register(`${lang}_hotelName`)} />
            </Field>
            <Field
              label={`Room type (${lang.toUpperCase()})`}
              htmlFor={`p-hotel-room-${lang}`}
              error={errors[`${lang}_hotelRoomType`]?.message}
            >
              <Input id={`p-hotel-room-${lang}`} {...register(`${lang}_hotelRoomType`)} />
            </Field>
            <Field
              label={`Hotel description (${lang.toUpperCase()})`}
              htmlFor={`p-hotel-desc-${lang}`}
              error={errors[`${lang}_hotelDescription`]?.message}
            >
              <Textarea id={`p-hotel-desc-${lang}`} rows={2} {...register(`${lang}_hotelDescription`)} />
            </Field>
          </div>
        ))}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stars" htmlFor="p-hotel-stars" error={errors.hotelStars?.message as string | undefined}>
            <Input id="p-hotel-stars" type="number" min={1} max={5} {...register('hotelStars')} />
          </Field>
          <Field label="Nights" htmlFor="p-hotel-nights" error={errors.hotelNights?.message as string | undefined}>
            <Input id="p-hotel-nights" type="number" min={0} {...register('hotelNights')} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-navy-200 p-4">
        <legend className="px-1 text-sm font-semibold text-navy-900">Tours</legend>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-md bg-navy-50/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-navy-500">
                Tour {index + 1}
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            {LOCALES.map((lang) => (
              <div key={lang} className="space-y-2">
                <Field
                  label={`Title (${lang.toUpperCase()})`}
                  htmlFor={`p-tour-title-${index}-${lang}`}
                  required
                  error={errors.tours?.[index]?.[`${lang}_title`]?.message}
                >
                  <Input
                    id={`p-tour-title-${index}-${lang}`}
                    {...register(`tours.${index}.${lang}_title`)}
                  />
                </Field>
                <Field
                  label={`Description (${lang.toUpperCase()})`}
                  htmlFor={`p-tour-desc-${index}-${lang}`}
                  required
                  error={errors.tours?.[index]?.[`${lang}_description`]?.message}
                >
                  <Textarea
                    id={`p-tour-desc-${index}-${lang}`}
                    rows={2}
                    {...register(`tours.${index}.${lang}_description`)}
                  />
                </Field>
              </div>
            ))}
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={() => append(emptyTour())}>
          Add tour
        </Button>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price from" htmlFor="p-price" error={errors.priceFrom?.message as string | undefined}>
          <Input id="p-price" type="number" min={0} step="1" {...register('priceFrom')} />
        </Field>
        <Field label="Currency" htmlFor="p-currency" error={errors.currency?.message}>
          <Input id="p-currency" placeholder="USD" maxLength={3} {...register('currency')} />
        </Field>
        <Field label="Photo URL" htmlFor="p-photo" error={errors.photoUrl?.message}>
          <Input id="p-photo" placeholder="https://..." {...register('photoUrl')} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-navy-800">
        <input type="checkbox" className="h-4 w-4" {...register('isActive')} />
        Active (visible publicly)
      </label>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save package'}
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
