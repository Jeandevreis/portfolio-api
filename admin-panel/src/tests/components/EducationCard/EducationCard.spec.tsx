import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router-dom';

import EducationCard from '@/components/EducationCard';
import * as educationHelpers from '@/helpers/educationHelpers';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue || key,
    i18n: { language: 'en' }
  })
}));

vi.mock('@/helpers/educationHelpers', () => ({
  getEducationData: vi.fn(),
  getStatusColor: vi.fn(() => 'border-green-500'),
  formatDate: vi.fn()
}));

const mockEducation: any = {
  id: '123-abc',
  type: 'course',
  status: 'completed',
  imageUrl: 'https://via.placeholder.com/150',
  durationHours: 40,
  startDate: '2023-01-01',
  endDate: '2023-02-01',
  certificateUrl: 'https://example.com/certificate.pdf',
};

describe('EducationCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(educationHelpers.getEducationData).mockImplementation((_, field) => {
      if (field === 'institution') return 'Tech University';
      if (field === 'name') return 'React Masterclass';
      return '';
    });

    vi.mocked(educationHelpers.formatDate).mockImplementation((date) => {
      return date === '2023-01-01' ? 'Jan 2023' : 'Feb 2023';
    });
  });

  it('should render education data correctly', () => {
    const mockOnDelete = vi.fn();

    render(
      <MemoryRouter>
        <EducationCard education={mockEducation} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('Tech University')).toBeInTheDocument();
    expect(screen.getByText('React Masterclass')).toBeInTheDocument();
    expect(screen.getByText('course')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText(/40h/)).toBeInTheDocument();
    expect(screen.getByText('Jan 2023')).toBeInTheDocument();
    expect(screen.getByText('Feb 2023')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockEducation.imageUrl);

    expect(screen.getByRole('link', { name: 'educations.card.certificate' })).toHaveAttribute('href', mockEducation.certificateUrl);
  });

  it('should render fallbacks when image and certificate are missing', () => {
    const mockOnDelete = vi.fn();
    const educationWithoutMedia = {
      ...mockEducation,
      imageUrl: undefined,
      certificateUrl: undefined,
    };

    render(
      <MemoryRouter>
        <EducationCard education={educationWithoutMedia} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    expect(screen.getByText('educations.card.no_image')).toBeInTheDocument();
    expect(screen.getByText('educations.card.no_link')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should call onDelete with the correct id when delete button is clicked', async () => {
    const mockOnDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <EducationCard education={mockEducation} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTitle('Excluir');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockEducation.id);
  });
});
