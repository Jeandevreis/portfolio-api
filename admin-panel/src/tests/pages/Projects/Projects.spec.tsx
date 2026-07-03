import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Projects from '@/pages/Projects';

import { useProjects } from '@/hooks/useProjects';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
}));

vi.mock('@/hooks/useProjects', () => ({
  useProjects: vi.fn(),
}));

vi.mock('@/components/Background', () => ({
  default: () => <div data-testid="mock-background" />
}));

vi.mock('@/components/ProjectCard', () => ({
  default: ({ project, onDelete }: any) => (
    <div data-testid="mock-project-card">
      <span data-testid="project-title">{project.title}</span>
      <button onClick={() => onDelete(project.id)} data-testid={`delete-btn-${project.id}`}>
        Delete
      </button>
    </div>
  )
}));

describe('Projects Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header, background and links correctly', () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: [],
      loading: false,
      globalError: null,
      deleteProject: vi.fn(),
    } as any);

    render(<Projects />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByText('My Projects')).toBeInTheDocument();

    const links = screen.getAllByTestId('mock-link');
    expect(links[0]).toHaveAttribute('href', '/panel');
    expect(links[1]).toHaveAttribute('href', '/projects/create');
  });

  it('should render the loading state', () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: [],
      loading: true,
      globalError: null,
      deleteProject: vi.fn(),
    } as any);

    const { container } = render(<Projects />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    expect(screen.queryByText('No projects found.')).not.toBeInTheDocument();
  });

  it('should render the global error state', () => {
    const errorMessage = 'Failed to fetch projects from server.';

    vi.mocked(useProjects).mockReturnValue({
      projects: [],
      loading: false,
      globalError: errorMessage,
      deleteProject: vi.fn(),
    } as any);

    render(<Projects />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText('No projects found.')).not.toBeInTheDocument();
  });

  it('should render the empty state when there are no projects', () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: [],
      loading: false,
      globalError: null,
      deleteProject: vi.fn(),
    } as any);

    render(<Projects />);

    expect(screen.getByText('No projects found.')).toBeInTheDocument();
    expect(screen.getByText('Start by adding your first project.')).toBeInTheDocument();
  });

  it('should render the list of projects correctly', () => {
    const mockProjects = [
      { id: '1', title: 'My Awesome Portfolio' },
      { id: '2', title: 'E-commerce API' },
    ];

    vi.mocked(useProjects).mockReturnValue({
      projects: mockProjects,
      loading: false,
      globalError: null,
      deleteProject: vi.fn(),
    } as any);

    render(<Projects />);

    const cards = screen.getAllByTestId('mock-project-card');
    expect(cards).toHaveLength(2);

    expect(screen.getByText('My Awesome Portfolio')).toBeInTheDocument();
    expect(screen.getByText('E-commerce API')).toBeInTheDocument();

    expect(screen.queryByText('No projects found.')).not.toBeInTheDocument();
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });
});
