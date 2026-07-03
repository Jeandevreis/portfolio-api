import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CreateProject from '@/pages/Projects/CreateProject';

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

describe('CreateProject Page Component', () => {
  const mockCreateProject = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProjects).mockReturnValue({
      imagePreview: null,
      isSubmitting: false,
      globalError: null,
      handleFileChange: vi.fn(),
      register: vi.fn() as any,
      errors: {},
      fields: [],
      appendTranslation: vi.fn(),
      removeTranslation: vi.fn(),
      createProject: mockCreateProject,
    } as any);
  });

  it('should render the header texts, background and back link correctly', () => {
    render(<CreateProject />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();

    expect(screen.getByText('New Project')).toBeInTheDocument();
    expect(screen.getByText('Add a new project to your portfolio.')).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/projects');
    expect(link).toHaveTextContent('Back to list');
  });

  it('should pass the correct props to the ProjectForm', () => {
    vi.mocked(useProjects).mockReturnValue({
      ...vi.mocked(useProjects)(),
      isSubmitting: true,
      globalError: 'Some validation error',
    } as any);

    render(<CreateProject />);

    expect(screen.getByTestId('form-submit-btn')).toHaveTextContent('Save Project');

    expect(screen.getByTestId('form-is-submitting')).toHaveTextContent('submitting');

    expect(screen.getByTestId('form-global-error')).toHaveTextContent('Some validation error');
  });

  it('should trigger createProject function when the form is submitted', () => {
    render(<CreateProject />);

    const form = screen.getByTestId('mock-project-form');
    fireEvent.submit(form);

    expect(mockCreateProject).toHaveBeenCalledTimes(1);
  });
});
