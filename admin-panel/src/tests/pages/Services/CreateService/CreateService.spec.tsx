import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CreateService from '@/pages/Services/CreateService';

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

vi.mock('@/components/ServiceForm', () => ({
  default: ({ submitButtonText, onSubmitAction, globalError, isSubmitting }: any) => (
    <form
      data-testid="mock-service-form"
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

describe('CreateService Page Component', () => {
  const mockCreateService = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useServices).mockReturnValue({
      imagePreview: null,
      isSubmitting: false,
      globalError: null,
      handleFileChange: vi.fn(),
      register: vi.fn() as any,
      errors: {},
      fields: [],
      appendTranslation: vi.fn(),
      removeTranslation: vi.fn(),
      createService: mockCreateService,
    } as any);
  });

  it('should render the header texts, background and back link correctly', () => {
    render(<CreateService />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();

    expect(screen.getByText('Create new service')).toBeInTheDocument();
    expect(screen.getByText('Create a new service to be displayed on the website.')).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/services');
    expect(link).toHaveTextContent('Back to services');
  });

  it('should pass the correct props to the ServiceForm', () => {
    vi.mocked(useServices).mockReturnValue({
      ...vi.mocked(useServices)(),
      isSubmitting: true,
      globalError: 'Some validation error',
    } as any);

    render(<CreateService />);

    expect(screen.getByTestId('form-submit-btn')).toHaveTextContent('Save service');
    expect(screen.getByTestId('form-is-submitting')).toHaveTextContent('submitting');
    expect(screen.getByTestId('form-global-error')).toHaveTextContent('Some validation error');
  });

  it('should trigger createService function when the form is submitted', () => {
    render(<CreateService />);

    const form = screen.getByTestId('mock-service-form');
    fireEvent.submit(form);

    expect(mockCreateService).toHaveBeenCalledTimes(1);
  });
});
