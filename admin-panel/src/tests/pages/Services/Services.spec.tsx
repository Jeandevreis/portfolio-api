import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Services from '@/pages/Services';

import { useServices } from '@/hooks/useServices';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
}));

vi.mock('@/hooks/useServices', () => ({
  useServices: vi.fn(),
}));

vi.mock('@/components/Background', () => ({
  default: () => <div data-testid="mock-background" />
}));

vi.mock('@/components/ServiceCard', () => ({
  default: ({ service, onDelete }: any) => (
    <div data-testid="mock-service-card">
      <span data-testid="service-title">{service.title}</span>
      <button onClick={() => onDelete(service.id)} data-testid={`delete-btn-${service.id}`}>
        Delete
      </button>
    </div>
  )
}));

describe('Services Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header, background and links correctly', () => {
    vi.mocked(useServices).mockReturnValue({
      services: [],
      loading: false,
      globalError: null,
      deleteService: vi.fn(),
    } as any);

    render(<Services />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();

    const links = screen.getAllByTestId('mock-link');
    expect(links[0]).toHaveAttribute('href', '/panel');
    expect(links[1]).toHaveAttribute('href', '/services/create');

    expect(useServices).toHaveBeenCalledWith({ fetchList: true });
  });

  it('should render the loading state', () => {
    vi.mocked(useServices).mockReturnValue({
      services: [],
      loading: true,
      globalError: null,
      deleteService: vi.fn(),
    } as any);

    const { container } = render(<Services />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    expect(screen.queryByText('No services found.')).not.toBeInTheDocument();
  });

  it('should render the global error state', () => {
    const errorMessage = 'Failed to fetch services from server.';

    vi.mocked(useServices).mockReturnValue({
      services: [],
      loading: false,
      globalError: errorMessage,
      deleteService: vi.fn(),
    } as any);

    render(<Services />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText('No services found.')).not.toBeInTheDocument();
  });

  it('should render the empty state when there are no services', () => {
    vi.mocked(useServices).mockReturnValue({
      services: [],
      loading: false,
      globalError: null,
      deleteService: vi.fn(),
    } as any);

    render(<Services />);

    expect(screen.getByText('No services found.')).toBeInTheDocument();
    expect(screen.getByText('Register your first service to see it here.')).toBeInTheDocument();
  });

  it('should render the list of services correctly', () => {
    const mockServices = [
      { id: '1', title: 'Web Development' },
      { id: '2', title: 'UI/UX Design' },
    ];

    vi.mocked(useServices).mockReturnValue({
      services: mockServices,
      loading: false,
      globalError: null,
      deleteService: vi.fn(),
    } as any);

    render(<Services />);

    const cards = screen.getAllByTestId('mock-service-card');
    expect(cards).toHaveLength(2);

    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Design')).toBeInTheDocument();

    expect(screen.queryByText('No services found.')).not.toBeInTheDocument();
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });
});
