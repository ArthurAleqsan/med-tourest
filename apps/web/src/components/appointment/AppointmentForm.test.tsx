import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { getAppointmentDateRange } from '@mta/shared';
import { ApiRequestError } from '@/lib/api/http';
import { I18nProvider } from '@/i18n/client';
import { en } from '@/i18n/messages/en';

// --- Mocks -----------------------------------------------------------------
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: () => null }),
}));

const submitMock = vi.fn();
const getSpecialtiesMock = vi.fn();

vi.mock('@/lib/api/endpoints', () => ({
  getSpecialties: () => getSpecialtiesMock(),
  getDoctor: vi.fn(),
  submitAppointmentRequest: (body: unknown) => submitMock(body),
}));

import { AppointmentForm } from './AppointmentForm';

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <I18nProvider locale="en" messages={en}>
        {ui}
      </I18nProvider>
    </QueryClientProvider>,
  );
}

const range = getAppointmentDateRange();

beforeEach(() => {
  submitMock.mockReset();
  getSpecialtiesMock.mockReset();
  getSpecialtiesMock.mockResolvedValue([
    {
      id: 'a'.repeat(24),
      en_name: 'Cardiology',
      ru_name: 'Cardiology',
      am_name: 'Cardiology',
      slug: 'cardiology',
      en_shortDescription: 's',
      ru_shortDescription: 's',
      am_shortDescription: 's',
      en_description: 'd',
      ru_description: 'd',
      am_description: 'd',
      en_treatments: [],
      ru_treatments: [],
      am_treatments: [],
      isActive: true,
      displayOrder: 1,
      createdAt: '',
      updatedAt: '',
    },
  ]);
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => expect(screen.getByRole('option', { name: 'Cardiology' })).toBeInTheDocument());
  await user.selectOptions(screen.getByLabelText(/Specialty/i), 'a'.repeat(24));
  const dateInput = screen.getByLabelText(/Preferred date/i);
  await user.clear(dateInput);
  await user.type(dateInput, range.min);
  await user.type(screen.getByLabelText(/First name/i), 'Maria');
  await user.type(screen.getByLabelText(/Last name/i), 'Ivanova');
  await user.type(screen.getByLabelText(/Email/i), 'maria@example.com');
  await user.type(screen.getByLabelText(/Country/i), 'Georgia');
  await user.type(screen.getByLabelText(/Telegram username/i), '@maria_iv');
  await user.click(screen.getByRole('checkbox'));
}

describe('AppointmentForm', () => {
  it('shows validation errors when submitting empty', async () => {
    const user = userEvent.setup();
    renderWithClient(<AppointmentForm />);
    await user.click(screen.getByRole('button', { name: /Submit appointment request/i }));
    expect(await screen.findByText('First name is required.')).toBeInTheDocument();
    expect(screen.getByText('A preferred date is required.')).toBeInTheDocument();
    expect(submitMock).not.toHaveBeenCalled();
  });

  it('submits successfully and shows the reference number', async () => {
    submitMock.mockResolvedValue({
      referenceNumber: 'ARM-2026-000123',
      status: 'new',
      preferredDate: range.min,
      preferredTimePeriod: 'morning',
      createdAt: new Date().toISOString(),
    });
    const user = userEvent.setup();
    renderWithClient(<AppointmentForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /Submit appointment request/i }));

    expect(await screen.findByText('ARM-2026-000123')).toBeInTheDocument();
    expect(screen.getByText(/Request received/i)).toBeInTheDocument();
    expect(submitMock).toHaveBeenCalledTimes(1);
  });

  it('displays an API error message when submission fails', async () => {
    submitMock.mockRejectedValue(new ApiRequestError(400, 'Validation failed'));
    const user = userEvent.setup();
    renderWithClient(<AppointmentForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /Submit appointment request/i }));

    expect(await screen.findByText(/We couldn’t submit your request/i)).toBeInTheDocument();
  });
});
