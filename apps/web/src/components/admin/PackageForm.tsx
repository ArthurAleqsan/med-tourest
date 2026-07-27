'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PackageDto, PackageInput } from '@mta/shared';
import {
  arrayToLines,
  linesToArray,
  packageFormSchema,
  type PackageFormValues,
} from '@/lib/adminForms';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';

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
    name: values.name,
    durationDays: values.durationDays,
    shortDescription: values.shortDescription,
    description: values.description,
    hotel: {
      name: values.hotelName,
      stars,
      roomType: values.hotelRoomType || undefined,
      nights,
      description: values.hotelDescription || undefined,
    },
    tours: values.tours.map((tour) => ({
      title: tour.title,
      description: tour.description,
    })),
    inclusions: linesToArray(values.inclusions ?? ''),
    priceFrom,
    currency: values.currency?.trim() ? values.currency.trim().toUpperCase() : undefined,
    photoUrl: values.photoUrl || undefined,
    displayOrder: values.displayOrder,
    isActive: values.isActive,
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
    values: initial
      ? {
          name: initial.name,
          durationDays: initial.durationDays,
          shortDescription: initial.shortDescription,
          description: initial.description,
          hotelName: initial.hotel.name,
          hotelStars: initial.hotel.stars ?? '',
          hotelRoomType: initial.hotel.roomType ?? '',
          hotelNights: initial.hotel.nights ?? '',
          hotelDescription: initial.hotel.description ?? '',
          tours: initial.tours.length
            ? initial.tours
            : [{ title: '', description: '' }],
          inclusions: arrayToLines(initial.inclusions),
          priceFrom: initial.priceFrom ?? '',
          currency: initial.currency ?? 'USD',
          photoUrl: initial.photoUrl ?? '',
          displayOrder: initial.displayOrder,
          isActive: initial.isActive,
        }
      : {
          name: '',
          durationDays: 10,
          shortDescription: '',
          description: '',
          hotelName: '',
          hotelStars: '',
          hotelRoomType: '',
          hotelNights: '',
          hotelDescription: '',
          tours: [{ title: '', description: '' }],
          inclusions: '',
          priceFrom: '',
          currency: 'USD',
          photoUrl: '',
          displayOrder: 0,
          isActive: true,
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'tours' });

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(buildPayload(v)))}>
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      <Field label="Name" htmlFor="p-name" required error={errors.name?.message}>
        <Input id="p-name" {...register('name')} />
      </Field>

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

      <Field
        label="Short description"
        htmlFor="p-short"
        required
        error={errors.shortDescription?.message}
      >
        <Textarea id="p-short" rows={2} {...register('shortDescription')} />
      </Field>
      <Field label="Description" htmlFor="p-desc" required error={errors.description?.message}>
        <Textarea id="p-desc" rows={4} {...register('description')} />
      </Field>

      <fieldset className="space-y-3 rounded-lg border border-navy-200 p-4">
        <legend className="px-1 text-sm font-semibold text-navy-900">Hotel information</legend>
        <Field label="Hotel name" htmlFor="p-hotel-name" required error={errors.hotelName?.message}>
          <Input id="p-hotel-name" {...register('hotelName')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Stars" htmlFor="p-hotel-stars" error={errors.hotelStars?.message as string | undefined}>
            <Input id="p-hotel-stars" type="number" min={1} max={5} {...register('hotelStars')} />
          </Field>
          <Field label="Room type" htmlFor="p-hotel-room" error={errors.hotelRoomType?.message}>
            <Input id="p-hotel-room" {...register('hotelRoomType')} />
          </Field>
          <Field label="Nights" htmlFor="p-hotel-nights" error={errors.hotelNights?.message as string | undefined}>
            <Input id="p-hotel-nights" type="number" min={0} {...register('hotelNights')} />
          </Field>
        </div>
        <Field
          label="Hotel description"
          htmlFor="p-hotel-desc"
          error={errors.hotelDescription?.message}
        >
          <Textarea id="p-hotel-desc" rows={2} {...register('hotelDescription')} />
        </Field>
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-navy-200 p-4">
        <legend className="px-1 text-sm font-semibold text-navy-900">Tours</legend>
        <p className="text-sm text-navy-500">Short information about included tours and excursions.</p>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-md bg-navy-50/60 p-3">
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
            <Field
              label="Title"
              htmlFor={`p-tour-title-${index}`}
              required
              error={errors.tours?.[index]?.title?.message}
            >
              <Input id={`p-tour-title-${index}`} {...register(`tours.${index}.title`)} />
            </Field>
            <Field
              label="Short description"
              htmlFor={`p-tour-desc-${index}`}
              required
              error={errors.tours?.[index]?.description?.message}
            >
              <Textarea
                id={`p-tour-desc-${index}`}
                rows={2}
                {...register(`tours.${index}.description`)}
              />
            </Field>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          onClick={() => append({ title: '', description: '' })}
        >
          Add tour
        </Button>
      </fieldset>

      <Field
        label="Inclusions"
        htmlFor="p-inclusions"
        hint="One item per line (transfers, breakfast, coordinator, etc.)."
        error={errors.inclusions?.message}
      >
        <Textarea id="p-inclusions" rows={4} {...register('inclusions')} />
      </Field>

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
