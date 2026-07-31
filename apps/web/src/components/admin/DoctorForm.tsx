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
  LOCALES,
  LOCALE_SECTION_LABELS,
  type DoctorFormValues,
} from '@/lib/adminForms';
import { Field, Input, Select, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';
import { LanguageSection } from '@/components/admin/ui';

export function buildDoctorPayload(values: DoctorFormValues): DoctorInput {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    slug: values.slug,
    specialty: values.specialty,
    centerIds: values.centerIds,
    photoUrl: values.photoUrl || undefined,
    en_shortDescription: values.en_shortDescription,
    ru_shortDescription: values.ru_shortDescription,
    am_shortDescription: values.am_shortDescription,
    en_biography: values.en_biography,
    ru_biography: values.ru_biography,
    am_biography: values.am_biography,
    en_education: linesToArray(values.en_education ?? ''),
    ru_education: linesToArray(values.ru_education ?? ''),
    am_education: linesToArray(values.am_education ?? ''),
    en_certifications: linesToArray(values.en_certifications ?? ''),
    ru_certifications: linesToArray(values.ru_certifications ?? ''),
    am_certifications: linesToArray(values.am_certifications ?? ''),
    en_treatments: linesToArray(values.en_treatments ?? ''),
    ru_treatments: linesToArray(values.ru_treatments ?? ''),
    am_treatments: linesToArray(values.am_treatments ?? ''),
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

const emptyValues: DoctorFormValues = {
  firstName: '',
  lastName: '',
  slug: '',
  specialty: '',
  centerIds: [],
  photoUrl: '',
  en_shortDescription: '',
  ru_shortDescription: '',
  am_shortDescription: '',
  en_biography: '',
  ru_biography: '',
  am_biography: '',
  en_education: '',
  ru_education: '',
  am_education: '',
  en_certifications: '',
  ru_certifications: '',
  am_certifications: '',
  en_treatments: '',
  ru_treatments: '',
  am_treatments: '',
  languages: 'English',
  yearsOfExperience: 0,
  consultationPrice: '',
  consultationCurrency: 'USD',
  isFeatured: false,
  isActive: true,
};

function toFormValues(initial: DoctorDto): DoctorFormValues {
  return {
    firstName: initial.firstName,
    lastName: initial.lastName,
    slug: initial.slug,
    specialty: initial.specialty.id,
    centerIds: initial.centers.map((c) => c.id),
    photoUrl: initial.photoUrl ?? '',
    en_shortDescription: initial.en_shortDescription,
    ru_shortDescription: initial.ru_shortDescription,
    am_shortDescription: initial.am_shortDescription,
    en_biography: initial.en_biography,
    ru_biography: initial.ru_biography,
    am_biography: initial.am_biography,
    en_education: arrayToLines(initial.en_education),
    ru_education: arrayToLines(initial.ru_education),
    am_education: arrayToLines(initial.am_education),
    en_certifications: arrayToLines(initial.en_certifications),
    ru_certifications: arrayToLines(initial.ru_certifications),
    am_certifications: arrayToLines(initial.am_certifications),
    en_treatments: arrayToLines(initial.en_treatments),
    ru_treatments: arrayToLines(initial.ru_treatments),
    am_treatments: arrayToLines(initial.am_treatments),
    languages: arrayToLines(initial.languages),
    yearsOfExperience: initial.yearsOfExperience,
    consultationPrice: initial.consultationPrice ?? '',
    consultationCurrency: initial.consultationCurrency ?? '',
    isFeatured: initial.isFeatured,
    isActive: initial.isActive,
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
    defaultValues: initial ? toFormValues(initial) : emptyValues,
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

      <Field
        label="Slug"
        htmlFor="slug"
        required
        hint="URL path, e.g. aram-grigoryan"
        error={errors.slug?.message}
      >
        <Input id="slug" placeholder="doctor-slug" {...register('slug')} />
      </Field>

      <Field label="Specialty" htmlFor="specialty" required error={errors.specialty?.message}>
        <Select id="specialty" {...register('specialty')}>
          <option value="">Select a specialty</option>
          {specialtiesQuery.data?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.en_name}
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
                      <span className="truncate">{center.en_name}</span>
                      <span className="text-navy-500"> · {center.en_city}</span>
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

      {LOCALES.map((lang) => (
        <LanguageSection key={lang} title={LOCALE_SECTION_LABELS[lang]}>
          <Field
            label={`Short description (${lang.toUpperCase()})`}
            htmlFor={`shortDescription-${lang}`}
            required
            error={errors[`${lang}_shortDescription`]?.message}
          >
            <Textarea
              id={`shortDescription-${lang}`}
              rows={2}
              {...register(`${lang}_shortDescription`)}
            />
          </Field>
          <Field
            label={`Biography (${lang.toUpperCase()})`}
            htmlFor={`biography-${lang}`}
            required
            error={errors[`${lang}_biography`]?.message}
          >
            <Textarea id={`biography-${lang}`} rows={5} {...register(`${lang}_biography`)} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={`Education (${lang.toUpperCase()}, one per line)`} htmlFor={`education-${lang}`}>
              <Textarea id={`education-${lang}`} rows={3} {...register(`${lang}_education`)} />
            </Field>
            <Field
              label={`Certifications (${lang.toUpperCase()}, one per line)`}
              htmlFor={`certifications-${lang}`}
            >
              <Textarea id={`certifications-${lang}`} rows={3} {...register(`${lang}_certifications`)} />
            </Field>
          </div>
          <Field label={`Treatments (${lang.toUpperCase()}, one per line)`} htmlFor={`treatments-${lang}`}>
            <Textarea id={`treatments-${lang}`} rows={3} {...register(`${lang}_treatments`)} />
          </Field>
        </LanguageSection>
      ))}

      <Field
        label="Languages (one per line)"
        htmlFor="languages"
        required
        error={errors.languages?.message}
      >
        <Textarea id="languages" rows={3} {...register('languages')} />
      </Field>

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
