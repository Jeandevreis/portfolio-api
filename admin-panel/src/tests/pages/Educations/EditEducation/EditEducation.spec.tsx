import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import EditEducation from '@/pages/Educations/EditEducation';

import { useEducations } from '@/hooks/useEducations';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
  useParams: () => ({ id: '123' }),
}));

vi.mock('@/hooks/useEducations', () => ({
  useEducations: vi.fn(),
}));

vi.mock('@/components/Background', () => ({
  default: () => <div data-testid="mock-background" />
}));

vi.mock('@/components/EducationForm', () => ({
  default: ({ submitButtonText, onSubmitAction, globalError, isSubmitting }: any) => (
    <form
      data-testid="mock-education-form"
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

describe('EditEducation Page Component', () => {
  const mockSubmitHandler = vi.fn();
  const mockUpdateEducation = vi.fn().mockReturnValue(mockSubmitHandler);

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useEducations).mockReturnValue({
      loading: false,
      globalError: null,
      updateEducation: mockUpdateEducation,
      register: vi.fn() as any,
      errors: {},
      isSubmitting: false,
      fields: [],
      appendTranslation: vi.fn(),
      removeTranslation: vi.fn(),
      imagePreview: null,
      handleFileChange: vi.fn(),
    } as any);
  });

  it('should call useEducations with the ID from the URL', () => {
    render(<EditEducation />);

    expect(useEducations).toHaveBeenCalledWith({ editId: '123' });
  });

  it('should render the loading spinner when loading is true', () => {
    vi.mocked(useEducations).mockReturnValue({
      ...vi.mocked(useEducations)(),
      loading: true,
    } as any);

    const { container } = render(<EditEducation />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    expect(screen.queryByTestId('mock-education-form')).not.toBeInTheDocument();
  });

  it('should render the header texts, background, link, and form when loaded', () => {
    render(<EditEducation />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByText('Edit Education')).toBeInTheDocument();
    expect(screen.getByText('Update your course or degree information.')).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/educations');
    expect(link).toHaveTextContent('Back to educations');

    expect(screen.getByTestId('mock-education-form')).toBeInTheDocument();
  });

  it('should pass the correct props to the EducationForm and handle submission', () => {
    vi.mocked(useEducations).mockReturnValue({
      ...vi.mocked(useEducations)(),
      isSubmitting: true,
      globalError: 'Update failed',
    } as any);

    render(<EditEducation />);

    expect(screen.getByTestId('form-submit-btn')).toHaveTextContent('Save Education');
    expect(screen.getByTestId('form-is-submitting')).toHaveTextContent('submitting');
    expect(screen.getByTestId('form-global-error')).toHaveTextContent('Update failed');

    expect(mockUpdateEducation).toHaveBeenCalledWith('123');

    const form = screen.getByTestId('mock-education-form');
    fireEvent.submit(form);

    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  });
});
