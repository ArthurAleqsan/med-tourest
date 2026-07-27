'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SpecialtyDto, SpecialtyInput } from '@mta/shared';
import {
  arrayToLines,
  linesToArray,
  specialtyFormSchema,
  type SpecialtyFormValues,
} from '@/lib/adminForms';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';

function buildPayload(values: SpecialtyFormValues): SpecialtyInput {
  return {
    name: values.name,
    shortDescription: values.shortDescription,
    description: values.description,
    icon: values.icon || undefined,
    treatments: linesToArray(values.treatments ?? ''),
    displayOrder: values.displayOrder,
    isActive: values.isActive,
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
    values: initial
      ? {
          name: initial.name,
          shortDescription: initial.shortDescription,
          description: initial.description,
          icon: initial.icon ?? '',
          treatments: arrayToLines(initial.treatments),
          displayOrder: initial.displayOrder,
          isActive: initial.isActive,
        }
      : {
          name: '',
          shortDescription: '',
          description: '',
          icon: '',
          treatments: '',
          displayOrder: 0,
          isActive: true,
        },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(buildPayload(v)))}>
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}
      <Field label="Name" htmlFor="s-name" required error={errors.name?.message}>
        <Input id="s-name" {...register('name')} />
      </Field>
      <Field
        label="Short description"
        htmlFor="s-short"
        required
        error={errors.shortDescription?.message}
      >
        <Textarea id="s-short" rows={2} {...register('shortDescription')} />
      </Field>
      <Field label="Description" htmlFor="s-desc" required error={errors.description?.message}>
        <Textarea id="s-desc" rows={4} {...register('description')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Icon key" htmlFor="s-icon" hint="e.g. heart, tooth, brain">
          <Input id="s-icon" {...register('icon')} />
        </Field>
        <Field label="Display order" htmlFor="s-order" error={errors.displayOrder?.message}>
          <Input id="s-order" type="number" min={0} {...register('displayOrder')} />
        </Field>
      </div>
      <Field label="Treatments (one per line)" htmlFor="s-treatments">
        <Textarea id="s-treatments" rows={3} {...register('treatments')} />
      </Field>
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
