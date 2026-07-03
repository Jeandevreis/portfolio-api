import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import EditProject from '@/pages/Projects/EditProject';

import { useProjects } from '@/hooks/useProjects';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
  useParams: () => ({ id: '123' }),
}));

vi.mock('@/hooks/useProjects', () => ({
  useProjects: vi.fn(),
}));

vi.mock('@/components/Background', () => ({
  default: () => <div data-testid="mock-background" />
}));

vi.mock('@/components/ProjectForm', () => ({
  default: ({ submitButtonText, onSubmitAction, globalError, isSubmitting }: any) => (
    <form
      data-testid="mock-project-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitAction();
      }}
    >
      <span data-testid="form-global-error">{globalError}</span>
      <span data-testid="form-is-submitting">{isSubmitting ? 'submitting' : 'idle'}</span>
      <button type="submit" data-testid="form-submit-btn">{submitButtonText}</button>
    </form>
  )
}));

describe('EditProject Page Component', () => {
  const mockUpdateProjectSubmit = vi.fn();
  const mockUpdateProject = vi.fn().mockReturnValue(mockUpdateProjectSubmit);

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProjects).mockReturnValue({
      loading: false,
      globalError: null,
      updateProject: mockUpdateProject,
      register: vi.fn() as any,
      errors: {},
      fields: [],
      appendTranslation: vi.fn(),
      removeTranslation: vi.fn(),
      imagePreview: null,
      handleFileChange: vi.fn(),
    } as any);
  });

  it('should render the header texts, background and back link correctly', () => {
    render(<EditProject />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();

    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    expect(screen.getByText('Update your project information.')).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/projects');
    expect(link).toHaveTextContent('← Back to projects');

    expect(useProjects).toHaveBeenCalledWith({ editId: '123' });
  });

  it('should render the loading state', () => {
    vi.mocked(useProjects).mockReturnValue({
      ...vi.mocked(useProjects)(),
      loading: true,
    } as any);

    const { container } = render(<EditProject />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    expect(screen.queryByText('Edit Project')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-project-form')).not.toBeInTheDocument();
  });

  it('should pass the correct props to the ProjectForm', () => {
    vi.mocked(useProjects).mockReturnValue({
      ...vi.mocked(useProjects)(),
      isSubmitting: true,
      globalError: 'Some project editing error',
    } as any);

    render(<EditProject />);

    expect(screen.getByTestId('form-submit-btn')).toHaveTextContent('Save Project');
    expect(screen.getByTestId('form-is-submitting')).toHaveTextContent('submitting');
    expect(screen.getByTestId('form-global-error')).toHaveTextContent('Some project editing error');
  });

  it('should trigger updateProject submit action when the form is submitted', () => {
    render(<EditProject />);

    const form = screen.getByTestId('mock-project-form');
    fireEvent.submit(form);

    expect(mockUpdateProject).toHaveBeenCalledWith('123');
    expect(mockUpdateProjectSubmit).toHaveBeenCalledTimes(1);
  });
});
