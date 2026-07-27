'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MedicalCenterDto, MedicalCenterInput } from '@mta/shared';
import { centerFormSchema, type CenterFormValues } from '@/lib/adminForms';
import { Field, Input, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';

function buildPayload(values: CenterFormValues): MedicalCenterInput {
  return {
    name: values.name,
    shortDescription: values.shortDescription,
    description: values.description,
    address: values.address,
    city: values.city,
    phone: values.phone || undefined,
    email: values.email || undefined,
    website: values.website || undefined,
    photoUrl: values.photoUrl || undefined,
    displayOrder: values.displayOrder,
    isActive: values.isActive,
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
    values: initial
      ? {
          name: initial.name,
          shortDescription: initial.shortDescription,
          description: initial.description,
          address: initial.address,
          city: initial.city,
          phone: initial.phone ?? '',
          email: initial.email ?? '',
          website: initial.website ?? '',
          photoUrl: initial.photoUrl ?? '',
          displayOrder: initial.displayOrder,
          isActive: initial.isActive,
        }
      : {
          name: '',
          shortDescription: '',
          description: '',
          address: '',
          city: '',
          phone: '',
          email: '',
          website: '',
          photoUrl: '',
          displayOrder: 0,
          isActive: true,
        },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(buildPayload(v)))}>
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}
      <Field label="Name" htmlFor="c-name" required error={errors.name?.message}>
        <Input id="c-name" {...register('name')} />
      </Field>
      <Field
        label="Short description"
        htmlFor="c-short"
        required
        error={errors.shortDescription?.message}
      >
        <Textarea id="c-short" rows={2} {...register('shortDescription')} />
      </Field>
      <Field label="Description" htmlFor="c-desc" required error={errors.description?.message}>
        <Textarea id="c-desc" rows={4} {...register('description')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Address" htmlFor="c-address" required error={errors.address?.message}>
          <Input id="c-address" {...register('address')} />
        </Field>
        <Field label="City" htmlFor="c-city" required error={errors.city?.message}>
          <Input id="c-city" {...register('city')} />
        </Field>
      </div>
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
