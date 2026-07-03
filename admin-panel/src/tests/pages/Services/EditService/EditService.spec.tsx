import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import EditService from '@/pages/Services/EditService';

import { useServices } from '@/hooks/useServices';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
  useParams: () => ({ id: '456' }),
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

describe('EditService Page Component', () => {
  const mockUpdateServiceSubmit = vi.fn();
  const mockUpdateService = vi.fn().mockReturnValue(mockUpdateServiceSubmit);

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useServices).mockReturnValue({
      loading: false,
      globalError: null,
      updateService: mockUpdateService,
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
    render(<EditService />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();

    expect(screen.getByText('Edit Service')).toBeInTheDocument();
    expect(screen.getByText('Update the information for the selected service.')).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/services');
    expect(link).toHaveTextContent('Back to services');

    expect(useServices).toHaveBeenCalledWith({ editId: '456' });
  });

  it('should render the loading state', () => {
    vi.mocked(useServices).mockReturnValue({
      ...vi.mocked(useServices)(),
      loading: true,
    } as any);

    const { container } = render(<EditService />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    expect(screen.queryByText('Edit Service')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-service-form')).not.toBeInTheDocument();
  });

  it('should pass the correct props to the ServiceForm', () => {
    vi.mocked(useServices).mockReturnValue({
      ...vi.mocked(useServices)(),
      isSubmitting: true,
      globalError: 'Some service editing error',
    } as any);

    render(<EditService />);

    expect(screen.getByTestId('form-submit-btn')).toHaveTextContent('Save Service');
    expect(screen.getByTestId('form-is-submitting')).toHaveTextContent('submitting');
    expect(screen.getByTestId('form-global-error')).toHaveTextContent('Some service editing error');
  });

  it('should trigger updateService submit action when the form is submitted', () => {
    render(<EditService />);

    const form = screen.getByTestId('mock-service-form');
    fireEvent.submit(form);

    expect(mockUpdateService).toHaveBeenCalledWith('456');
    expect(mockUpdateServiceSubmit).toHaveBeenCalledTimes(1);
  });
});
