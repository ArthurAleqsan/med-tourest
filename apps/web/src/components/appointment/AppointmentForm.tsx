'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  PREFERRED_TIME_PERIODS,
  getAppointmentDateRange,
  type AppointmentSubmissionResult,
} from '@mta/shared';
import { getDoctor, getSpecialties, submitAppointmentRequest } from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { createAppointmentFormSchema, type AppointmentFormValues } from '@/lib/appointmentForm';
import { Field, Input, Select, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';
import { useI18n } from '@/i18n/client';
import { useLocalized } from '@/lib/useLocalized';
import { AppointmentSuccess } from './AppointmentSuccess';

export function AppointmentForm() {
  const { m, t } = useI18n();
  const { loc } = useLocalized();
  const searchParams = useSearchParams();
  const doctorSlug = searchParams.get('doctor') ?? undefined;
  const doctorIdParam = searchParams.get('doctorId') ?? undefined;
  const specialtyIdParam = searchParams.get('specialtyId') ?? undefined;

  const range = getAppointmentDateRange();
  const schema = useMemo(() => createAppointmentFormSchema(m.validation), [m.validation]);

  const specialtiesQuery = useQuery({ queryKey: ['specialties'], queryFn: () => getSpecialties() });
  const doctorQuery = useQuery({
    queryKey: ['doctor', doctorSlug],
    queryFn: () => getDoctor(doctorSlug as string),
    enabled: Boolean(doctorSlug),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      doctorId: doctorIdParam,
      specialtyId: specialtyIdParam ?? '',
      preferredTimePeriod: 'no_preference',
      preferredContactMethod: 'telegram',
      consentAccepted: false,
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      contactValue: '',
    },
  });

  // Lock the specialty to the preselected doctor's specialty once loaded.
  useEffect(() => {
    if (doctorQuery.data) {
      setValue('doctorId', doctorQuery.data.doctor.id);
      setValue('specialtyId', doctorQuery.data.doctor.specialty.id);
    }
  }, [doctorQuery.data, setValue]);

  const mutation = useMutation({
    mutationFn: (values: AppointmentFormValues) =>
      submitAppointmentRequest({
        doctorId: values.doctorId || undefined,
        specialtyId: values.specialtyId,
        preferredDate: values.preferredDate,
        preferredTimePeriod: values.preferredTimePeriod,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        country: values.country,
        phoneNumber: values.phoneNumber || undefined,
        preferredContactMethod: values.preferredContactMethod,
        contactValue: values.contactValue,
        message: values.message || undefined,
        medicalInformation: values.medicalInformation || undefined,
        consentAccepted: true,
        // The shared input type expects the literal true; cast is safe here.
      } as Parameters<typeof submitAppointmentRequest>[0]),
  });

  const contactMethod = watch('preferredContactMethod');
  const lockedDoctorName = doctorQuery.data?.doctor.fullName;

  if (mutation.isSuccess) {
    const result = mutation.data as AppointmentSubmissionResult;
    return (
      <AppointmentSuccess
        result={result}
        onReset={() => {
          mutation.reset();
          reset();
        }}
      />
    );
  }

  const submitError =
    mutation.error instanceof ApiRequestError
      ? mutation.error
      : mutation.isError
        ? new ApiRequestError(500, m.contactForm.errorGeneric)
        : null;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="space-y-8"
    >
      <Alert tone="warning" title={m.appointmentForm.safetyTitle}>
        {m.safetyNotice}
      </Alert>

      {submitError && (
        <Alert tone="error" title={m.appointmentForm.submitErrorTitle}>
          {submitError.message}
          {submitError.fieldErrors && submitError.fieldErrors.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {submitError.fieldErrors.map((fe) => (
                <li key={fe.field}>{fe.message}</li>
              ))}
            </ul>
          )}
        </Alert>
      )}

      <fieldset className="space-y-5">
        <legend className="text-lg font-semibold text-navy-900">
          {m.appointmentForm.sectionAppointment}
        </legend>

        {lockedDoctorName && (
          <Alert tone="info">{t(m.appointmentForm.requestingWith, { name: lockedDoctorName })}</Alert>
        )}
        <input type="hidden" {...register('doctorId')} />

        <Field
          label={m.appointmentForm.specialtyLabel}
          htmlFor="specialtyId"
          required
          error={errors.specialtyId?.message}
        >
          <Select
            id="specialtyId"
            aria-invalid={Boolean(errors.specialtyId)}
            disabled={Boolean(lockedDoctorName)}
            {...register('specialtyId')}
          >
            <option value="">{m.appointmentForm.selectSpecialty}</option>
            {specialtiesQuery.data?.map((s) => (
              <option key={s.id} value={s.id}>
                {loc(s, 'name')}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={m.appointmentForm.preferredDateLabel}
            htmlFor="preferredDate"
            required
            hint={t(m.appointmentForm.preferredDateHint, { min: range.min, max: range.max })}
            error={errors.preferredDate?.message}
          >
            <Input
              id="preferredDate"
              type="date"
              min={range.min}
              max={range.max}
              aria-invalid={Boolean(errors.preferredDate)}
              {...register('preferredDate')}
            />
          </Field>

          <Field label={m.appointmentForm.preferredTimeLabel} htmlFor="preferredTimePeriod">
            <Select id="preferredTimePeriod" {...register('preferredTimePeriod')}>
              {PREFERRED_TIME_PERIODS.map((value) => (
                <option key={value} value={value}>
                  {m.timePeriods[value]}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-lg font-semibold text-navy-900">
          {m.appointmentForm.sectionYourDetails}
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={m.appointmentForm.firstName}
            htmlFor="firstName"
            required
            error={errors.firstName?.message}
          >
            <Input
              id="firstName"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              {...register('firstName')}
            />
          </Field>
          <Field
            label={m.appointmentForm.lastName}
            htmlFor="lastName"
            required
            error={errors.lastName?.message}
          >
            <Input
              id="lastName"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              {...register('lastName')}
            />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={m.appointmentForm.email}
            htmlFor="email"
            required
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </Field>
          <Field
            label={m.appointmentForm.country}
            htmlFor="country"
            required
            error={errors.country?.message}
          >
            <Input
              id="country"
              autoComplete="country-name"
              aria-invalid={Boolean(errors.country)}
              {...register('country')}
            />
          </Field>
        </div>
        <Field
          label={m.appointmentForm.phoneOptional}
          htmlFor="phoneNumber"
          error={errors.phoneNumber?.message}
        >
          <Input
            id="phoneNumber"
            type="tel"
            autoComplete="tel"
            placeholder="+374..."
            {...register('phoneNumber')}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-lg font-semibold text-navy-900">
          {m.appointmentForm.sectionContact}
        </legend>
        <div>
          <span className="mb-2 block text-sm font-medium text-navy-800">
            {m.appointmentForm.preferredContactMethod} <span className="text-red-500">*</span>
          </span>
          <div className="flex flex-wrap gap-3">
            {(['telegram', 'whatsapp'] as const).map((method) => (
              <label
                key={method}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-navy-100 px-4 py-2.5 text-sm font-medium has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
              >
                <input type="radio" value={method} {...register('preferredContactMethod')} />
                {m.appointmentForm[method]}
              </label>
            ))}
          </div>
          {errors.preferredContactMethod && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-600">
              {errors.preferredContactMethod.message}
            </p>
          )}
        </div>

        <Field
          label={
            contactMethod === 'telegram'
              ? m.appointmentForm.telegramUsername
              : m.appointmentForm.whatsappNumber
          }
          htmlFor="contactValue"
          required
          hint={
            contactMethod === 'telegram'
              ? m.appointmentForm.telegramHint
              : m.appointmentForm.whatsappHint
          }
          error={errors.contactValue?.message}
        >
          <Input
            id="contactValue"
            aria-invalid={Boolean(errors.contactValue)}
            placeholder={contactMethod === 'telegram' ? '@username' : '+37412345678'}
            {...register('contactValue')}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-lg font-semibold text-navy-900">
          {m.appointmentForm.sectionAdditional}
        </legend>
        <Field
          label={m.appointmentForm.medicalLabel}
          htmlFor="medicalInformation"
          error={errors.medicalInformation?.message}
          hint={m.appointmentForm.medicalHint}
        >
          <Textarea id="medicalInformation" rows={3} {...register('medicalInformation')} />
        </Field>
        <Field
          label={m.appointmentForm.messageLabel}
          htmlFor="message"
          error={errors.message?.message}
        >
          <Textarea id="message" rows={3} {...register('message')} />
        </Field>
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-navy-700">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-navy-300"
            aria-invalid={Boolean(errors.consentAccepted)}
            {...register('consentAccepted')}
          />
          <span>
            {m.appointmentForm.consentText} <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consentAccepted && (
          <p role="alert" className="mt-1 text-xs font-medium text-red-600">
            {errors.consentAccepted.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" fullWidth disabled={isSubmitting || mutation.isPending}>
        {mutation.isPending ? m.appointmentForm.submitting : m.appointmentForm.submit}
      </Button>
    </form>
  );
}
