'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import type { DoctorDto, DoctorInput } from '@mta/shared';
import { getCenters, getSpecialties } from '@/lib/api/endpoints';
import {
  arrayToLines,
  doctorFormSchema,
  linesToArray,
  type DoctorFormValues,
} from '@/lib/adminForms';
import { Field, Input, Select, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';

export function buildDoctorPayload(values: DoctorFormValues): DoctorInput {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    specialty: values.specialty,
    centerIds: values.centerIds,
    photoUrl: values.photoUrl || undefined,
    shortDescription: values.shortDescription,
    biography: values.biography,
    education: linesToArray(values.education ?? ''),
    certifications: linesToArray(values.certifications ?? ''),
    treatments: linesToArray(values.treatments ?? ''),
    languages: linesToArray(values.languages),
    yearsOfExperience: values.yearsOfExperience,
    consultationPrice:
      values.consultationPrice === '' || values.consultationPrice === undefined
        ? undefined
        : Number(values.consultationPrice),
    consultationCurrency: values.consultationCurrency || undefined,
    isFeatured: values.isFeatured,
    isActive: values.isActive,
  };
}

export function DoctorForm({
  initial,
  submitting,
  errorMessage,
  onSubmit,
}: {
  initial?: DoctorDto;
  submitting: boolean;
  errorMessage?: string | null;
  onSubmit: (payload: DoctorInput) => void;
}) {
  const specialtiesQuery = useQuery({ queryKey: ['specialties'], queryFn: () => getSpecialties() });
  const centersQuery = useQuery({ queryKey: ['centers'], queryFn: () => getCenters() });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: initial
      ? {
          firstName: initial.firstName,
          lastName: initial.lastName,
          specialty: initial.specialty.id,
          centerIds: initial.centers.map((c) => c.id),
          photoUrl: initial.photoUrl ?? '',
          shortDescription: initial.shortDescription,
          biography: initial.biography,
          education: arrayToLines(initial.education),
          certifications: arrayToLines(initial.certifications),
          treatments: arrayToLines(initial.treatments),
          languages: arrayToLines(initial.languages),
          yearsOfExperience: initial.yearsOfExperience,
          consultationPrice: initial.consultationPrice ?? '',
          consultationCurrency: initial.consultationCurrency ?? '',
          isFeatured: initial.isFeatured,
          isActive: initial.isActive,
        }
      : {
          firstName: '',
          lastName: '',
          specialty: '',
          centerIds: [],
          photoUrl: '',
          shortDescription: '',
          biography: '',
          education: '',
          certifications: '',
          treatments: '',
          languages: 'English',
          yearsOfExperience: 0,
          consultationPrice: '',
          consultationCurrency: 'USD',
          isFeatured: false,
          isActive: true,
        },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => onSubmit(buildDoctorPayload(values)))}
    >
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" required error={errors.firstName?.message}>
          <Input id="firstName" {...register('firstName')} />
        </Field>
        <Field label="Last name" htmlFor="lastName" required error={errors.lastName?.message}>
          <Input id="lastName" {...register('lastName')} />
        </Field>
      </div>

      <Field label="Specialty" htmlFor="specialty" required error={errors.specialty?.message}>
        <Select id="specialty" {...register('specialty')}>
          <option value="">Select a specialty</option>
          {specialtiesQuery.data?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Medical centers"
        htmlFor="centerIds"
        required
        error={errors.centerIds?.message}
        hint="Select one or more centers where this doctor practises."
      >
        <Controller
          control={control}
          name="centerIds"
          render={({ field }) => (
            <div
              id="centerIds"
              className="grid max-h-56 gap-1.5 overflow-y-auto rounded-lg border border-navy-200 p-3 sm:grid-cols-2"
            >
              {centersQuery.isLoading && (
                <p className="text-sm text-navy-500">Loading centers…</p>
              )}
              {centersQuery.data && centersQuery.data.length === 0 && (
                <p className="text-sm text-navy-500">
                  No centers yet. Create one under Medical Centers first.
                </p>
              )}
              {centersQuery.data?.map((center) => {
                const checked = field.value?.includes(center.id) ?? false;
                return (
                  <label
                    key={center.id}
                    className="flex items-center gap-2 text-sm text-navy-800"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={checked}
                      onChange={(e) => {
                        const set = new Set(field.value ?? []);
                        if (e.target.checked) set.add(center.id);
                        else set.delete(center.id);
                        field.onChange(Array.from(set));
                      }}
                    />
                    <span className="min-w-0">
                      <span className="truncate">{center.name}</span>
                      <span className="text-navy-500"> · {center.city}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        />
      </Field>

      <Field label="Photo URL" htmlFor="photoUrl" error={errors.photoUrl?.message}>
        <Input id="photoUrl" placeholder="https://..." {...register('photoUrl')} />
      </Field>

      <Field
        label="Short description"
        htmlFor="shortDescription"
        required
        error={errors.shortDescription?.message}
      >
        <Textarea id="shortDescription" rows={2} {...register('shortDescription')} />
      </Field>

      <Field label="Biography" htmlFor="biography" required error={errors.biography?.message}>
        <Textarea id="biography" rows={5} {...register('biography')} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Education (one per line)" htmlFor="education">
          <Textarea id="education" rows={3} {...register('education')} />
        </Field>
        <Field label="Certifications (one per line)" htmlFor="certifications">
          <Textarea id="certifications" rows={3} {...register('certifications')} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Treatments (one per line)" htmlFor="treatments">
          <Textarea id="treatments" rows={3} {...register('treatments')} />
        </Field>
        <Field
          label="Languages (one per line)"
          htmlFor="languages"
          required
          error={errors.languages?.message}
        >
          <Textarea id="languages" rows={3} {...register('languages')} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Years of experience"
          htmlFor="yearsOfExperience"
          required
          error={errors.yearsOfExperience?.message}
        >
          <Input id="yearsOfExperience" type="number" min={0} {...register('yearsOfExperience')} />
        </Field>
        <Field label="Consultation price" htmlFor="consultationPrice" error={errors.consultationPrice?.message}>
          <Input id="consultationPrice" type="number" min={0} {...register('consultationPrice')} />
        </Field>
        <Field label="Currency" htmlFor="consultationCurrency">
          <Input id="consultationCurrency" maxLength={3} {...register('consultationCurrency')} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input type="checkbox" className="h-4 w-4" {...register('isFeatured')} />
          Featured doctor
        </label>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input type="checkbox" className="h-4 w-4" {...register('isActive')} />
          Active (visible publicly)
        </label>
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save doctor'}
      </Button>
    </form>
  );
}
