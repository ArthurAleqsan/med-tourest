'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { ContactMethod, ContactRequestInput } from '@mta/shared';
import { submitContactRequest } from '@/lib/api/endpoints';
import { ApiRequestError } from '@/lib/api/http';
import { createContactFormSchema, type ContactFormValues } from '@/lib/contactForm';
import { Field, Input, Select, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback';
import { Card } from '@/components/ui/Card';
import { useI18n } from '@/i18n/client';

export function ContactForm() {
  const { m } = useI18n();
  const schema = useMemo(() => createContactFormSchema(m.validation), [m.validation]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', message: '', subject: '', contactValue: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: ContactFormValues) => {
      const payload: ContactRequestInput = {
        fullName: values.fullName,
        email: values.email,
        message: values.message,
        subject: values.subject || undefined,
        preferredContactMethod: values.preferredContactMethod
          ? (values.preferredContactMethod as ContactMethod)
          : undefined,
        contactValue: values.contactValue || undefined,
      };
      return submitContactRequest(payload);
    },
    onSuccess: () => reset(),
  });

  if (mutation.isSuccess) {
    return (
      <Card>
        <Alert tone="success" title={m.contactForm.successTitle}>
          {m.contactForm.successBody}
        </Alert>
        <Button variant="ghost" className="mt-4" onClick={() => mutation.reset()}>
          {m.contactForm.sendAnother}
        </Button>
      </Card>
    );
  }

  const error = mutation.error instanceof ApiRequestError ? mutation.error : null;

  return (
    <Card>
      <form noValidate className="space-y-5" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        {(error || mutation.isError) && (
          <Alert tone="error" title={m.contactForm.errorTitle}>
            {error?.message ?? m.contactForm.errorGeneric}
          </Alert>
        )}

        <Field
          label={m.contactForm.fullName}
          htmlFor="fullName"
          required
          error={errors.fullName?.message}
        >
          <Input
            id="fullName"
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            {...register('fullName')}
          />
        </Field>

        <Field label={m.contactForm.email} htmlFor="email" required error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={m.contactForm.preferredMethodOptional} htmlFor="preferredContactMethod">
            <Select id="preferredContactMethod" {...register('preferredContactMethod')}>
              <option value="">{m.contactForm.emailIsFine}</option>
              <option value="telegram">{m.contactForm.telegram}</option>
              <option value="whatsapp">{m.contactForm.whatsapp}</option>
            </Select>
          </Field>
          <Field
            label={m.contactForm.contactDetailsOptional}
            htmlFor="contactValue"
            error={errors.contactValue?.message}
          >
            <Input
              id="contactValue"
              placeholder={m.contactForm.contactPlaceholder}
              {...register('contactValue')}
            />
          </Field>
        </div>

        <Field
          label={m.contactForm.subjectOptional}
          htmlFor="subject"
          error={errors.subject?.message}
        >
          <Input id="subject" {...register('subject')} />
        </Field>

        <Field
          label={m.contactForm.message}
          htmlFor="message"
          required
          error={errors.message?.message}
        >
          <Textarea
            id="message"
            rows={5}
            aria-invalid={Boolean(errors.message)}
            {...register('message')}
          />
        </Field>

        <Button type="submit" size="lg" fullWidth disabled={mutation.isPending}>
          {mutation.isPending ? m.contactForm.sending : m.contactForm.send}
        </Button>
      </form>
    </Card>
  );
}
