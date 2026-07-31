import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { I18nProvider } from '@/i18n/client';
import { en } from '@/i18n/messages/en';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => new URLSearchParams(''),
}));

const getDoctorsMock = vi.fn();
const getSpecialtiesMock = vi.fn();
const getCentersMock = vi.fn();

vi.mock('@/lib/api/endpoints', () => ({
  getDoctors: (params: unknown) => getDoctorsMock(params),
  getSpecialties: () => getSpecialtiesMock(),
  getCenters: () => getCentersMock(),
}));

import { DoctorsBrowser } from './DoctorsBrowser';

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

const doctor = {
  id: 'd1',
  firstName: 'Aram',
  lastName: 'Grigoryan',
  fullName: 'Aram Grigoryan',
  slug: 'aram-grigoryan',
  specialty: { id: 's1', en_name: 'Cardiology', ru_name: 'Cardiology', am_name: 'Cardiology', slug: 'cardiology' },
  centers: [{ id: 'c1', en_name: 'Heart Care', ru_name: 'Heart Care', am_name: 'Heart Care', slug: 'heart-care', en_city: 'Yerevan' }],
  en_shortDescription: 'Experienced cardiologist.',
  ru_shortDescription: 'Experienced cardiologist.',
  am_shortDescription: 'Experienced cardiologist.',
  en_biography: 'Bio',
  ru_biography: 'Bio',
  am_biography: 'Bio',
  en_education: [],
  ru_education: [],
  am_education: [],
  en_certifications: [],
  ru_certifications: [],
  am_certifications: [],
  en_treatments: [],
  ru_treatments: [],
  am_treatments: [],
  languages: ['English'],
  yearsOfExperience: 20,
  isFeatured: true,
  isActive: true,
  createdAt: '',
  updatedAt: '',
};

beforeEach(() => {
  replaceMock.mockReset();
  getDoctorsMock.mockReset();
  getSpecialtiesMock.mockReset();
  getCentersMock.mockReset();
  getCentersMock.mockResolvedValue([]);
  getSpecialtiesMock.mockResolvedValue([
    { id: 's1', en_name: 'Cardiology', ru_name: 'Cardiology', am_name: 'Cardiology', slug: 'cardiology', en_shortDescription: '', ru_shortDescription: '', am_shortDescription: '', en_description: '', ru_description: '', am_description: '', en_treatments: [], ru_treatments: [], am_treatments: [], isActive: true, displayOrder: 1, createdAt: '', updatedAt: '' },
  ]);
  getDoctorsMock.mockResolvedValue({
    data: [doctor],
    pagination: {
      page: 1,
      limit: 9,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });
});

describe('DoctorsBrowser', () => {
  it('renders fetched doctors', async () => {
    renderWithClient(<DoctorsBrowser />);
    expect(await screen.findByText('Dr. Aram Grigoryan')).toBeInTheDocument();
    expect(screen.getByText('1 doctor found')).toBeInTheDocument();
  });

  it('updates the URL when a specialty filter is chosen', async () => {
    const user = userEvent.setup();
    renderWithClient(<DoctorsBrowser />);
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Cardiology' })).toBeInTheDocument(),
    );
    await user.selectOptions(screen.getByLabelText('Specialty'), 'cardiology');
    expect(replaceMock).toHaveBeenCalled();
    const lastCall = replaceMock.mock.calls.at(-1)?.[0] as string;
    expect(lastCall).toContain('specialty=cardiology');
  });
});
