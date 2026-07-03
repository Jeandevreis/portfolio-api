import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CreateEducation from '@/pages/Educations/CreateEducation';

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

describe('CreateEducation Page Component', () => {
  const mockCreateEducation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useEducations).mockReturnValue({
      imagePreview: null,
      isSubmitting: false,
      globalError: null,
      handleFileChange: vi.fn(),
      register: vi.fn() as any,
      errors: {},
      fields: [],
      appendTranslation: vi.fn(),
      removeTranslation: vi.fn(),
      createEducation: mockCreateEducation,
    } as any);
  });

  it('should render the header texts, background and back link correctly', () => {
    render(<CreateEducation />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();

    expect(screen.getByText('New Education')).toBeInTheDocument();
    expect(screen.getByText('Add a new course or degree to your resume')).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/educations');
    expect(link).toHaveTextContent('Back to educations');
  });

  it('should pass the correct props to the EducationForm', () => {
    vi.mocked(useEducations).mockReturnValue({
      ...vi.mocked(useEducations)(),
      isSubmitting: true,
      globalError: 'Some validation error',
    } as any);

    render(<CreateEducation />);

    expect(screen.getByTestId('form-submit-btn')).toHaveTextContent('Save Education');

    expect(screen.getByTestId('form-is-submitting')).toHaveTextContent('submitting');

    expect(screen.getByTestId('form-global-error')).toHaveTextContent('Some validation error');
  });

  it('should trigger createEducation function when the form is submitted', () => {
    render(<CreateEducation />);

    const form = screen.getByTestId('mock-education-form');
    fireEvent.submit(form);

    expect(mockCreateEducation).toHaveBeenCalledTimes(1);
  });
});
