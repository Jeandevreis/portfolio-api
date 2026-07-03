import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ServiceCard from '@/components/ServiceCard';
import * as serviceHelpers from '@/helpers/serviceHelpers';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
    i18n: { language: 'en' }
  })
}));

vi.mock('@/helpers/serviceHelpers', () => ({
  getServiceData: vi.fn()
}));

vi.mock('@/components/EditButton', () => ({
  default: ({ title }: any) => <button title={title}>Edit</button>
}));

vi.mock('@/components/DeleteButton', () => ({
  default: ({ title, onDelete }: any) => <button title={title} onClick={onDelete}>Delete</button>
}));

const mockService: any = {
  id: 'svc-123',
  imageUrl: 'https://via.placeholder.com/150',
  link: 'https://service.com'
};

describe('ServiceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(serviceHelpers.getServiceData).mockImplementation((_, field) => {
      if (field === 'title') return 'Test Service';
      if (field === 'description') return 'Test Description';
      return '';
    });
  });

  it('should render service data correctly', () => {
    render(
      <MemoryRouter>
        <ServiceCard service={mockService} onDelete={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockService.imageUrl);
    expect(screen.getByRole('link', { name: '🔗 Access Service' })).toHaveAttribute('href', mockService.link);
  });

  it('should render fallbacks when image and link are missing', () => {
    const serviceWithoutMedia = {
      ...mockService,
      imageUrl: null,
      link: null
    };

    render(
      <MemoryRouter>
        <ServiceCard service={serviceWithoutMedia} onDelete={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('No image')).toBeInTheDocument();
    expect(screen.getByText('Indisponible link')).toBeInTheDocument(); // Ajustado aqui
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should call onDelete with the correct id when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();

    render(
      <MemoryRouter>
        <ServiceCard service={mockService} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTitle('Delete');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockService.id);
  });

  it('should render fallback title and description when getServiceData returns falsy values', () => {
    vi.mocked(serviceHelpers.getServiceData).mockReturnValue('');

    render(
      <MemoryRouter>
        <ServiceCard service={mockService} onDelete={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Title not defined')).toBeInTheDocument();
    expect(screen.getByText('No description')).toBeInTheDocument();
  });
});
