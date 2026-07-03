import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Educations from '@/pages/Educations';

import { useEducations } from '@/hooks/useEducations';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
}));

vi.mock('@/hooks/useEducations', () => ({
  useEducations: vi.fn(),
}));

vi.mock('@/components/Background', () => ({
  default: () => <div data-testid="mock-background" />
}));

vi.mock('@/components/EducationCard', () => ({
  default: ({ education, onDelete }: any) => (
    <div data-testid="mock-education-card">
      <span data-testid="education-title">{education.title}</span>
      <button onClick={() => onDelete(education.id)} data-testid={`delete-btn-${education.id}`}>
        Delete
      </button>
    </div>
  )
}));

describe('Educations Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header, background and links correctly', () => {
    vi.mocked(useEducations).mockReturnValue({
      educations: [],
      loading: false,
      globalError: null,
      deleteEducation: vi.fn(),
    } as any);

    render(<Educations />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByText('Educations')).toBeInTheDocument();

    const links = screen.getAllByTestId('mock-link');
    expect(links[0]).toHaveAttribute('href', '/panel');
    expect(links[1]).toHaveAttribute('href', '/educations/create');
  });

  it('should render the loading state', () => {
    vi.mocked(useEducations).mockReturnValue({
      educations: [],
      loading: true,
      globalError: null,
      deleteEducation: vi.fn(),
    } as any);

    const { container } = render(<Educations />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    expect(screen.queryByText('No educations found.')).not.toBeInTheDocument();
  });

  it('should render the global error state', () => {
    const errorMessage = 'Failed to fetch educations from server.';

    vi.mocked(useEducations).mockReturnValue({
      educations: [],
      loading: false,
      globalError: errorMessage,
      deleteEducation: vi.fn(),
    } as any);

    render(<Educations />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText('No educations found.')).not.toBeInTheDocument();
  });

  it('should render the empty state when there are no educations', () => {
    vi.mocked(useEducations).mockReturnValue({
      educations: [],
      loading: false,
      globalError: null,
      deleteEducation: vi.fn(),
    } as any);

    render(<Educations />);

    expect(screen.getByText('No educations found.')).toBeInTheDocument();
    expect(screen.getByText('Start by adding your courses and degrees.')).toBeInTheDocument();
  });

  it('should render the list of educations correctly', () => {
    const mockEducations = [
      { id: '1', title: 'Systems Analysis and Development' },
      { id: '2', title: 'React Masterclass' },
    ];

    vi.mocked(useEducations).mockReturnValue({
      educations: mockEducations,
      loading: false,
      globalError: null,
      deleteEducation: vi.fn(),
    } as any);

    render(<Educations />);

    const cards = screen.getAllByTestId('mock-education-card');
    expect(cards).toHaveLength(2);

    expect(screen.getByText('Systems Analysis and Development')).toBeInTheDocument();
    expect(screen.getByText('React Masterclass')).toBeInTheDocument();

    expect(screen.queryByText('No educations found.')).not.toBeInTheDocument();
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });
});