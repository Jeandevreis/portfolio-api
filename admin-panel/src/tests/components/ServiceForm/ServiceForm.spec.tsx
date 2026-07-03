import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ServiceForm from '@/components/ServiceForm';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key
  })
}));

vi.mock('@/components/Input', () => ({
  default: React.forwardRef(({ label, children, ...props }: any, ref: any) => (
    <div>
      <label>{label}</label>
      <input {...props} ref={ref} />
      {children}
    </div>
  ))
}));

vi.mock('@/components/Select', () => ({
  default: React.forwardRef(({ label, translationGroup, ...props }: any, ref: any) => (
    <div>
      <label>{label}</label>
      <select {...props} ref={ref} />
    </div>
  ))
}));

vi.mock('@/components/ImageSelector', () => ({
  default: () => <div data-testid="image-selector" />
}));

vi.mock('@/components/IconWrapper', () => ({
  default: ({ children }: any) => <span>{children}</span>
}));

const mockFields = [
  { id: 'uuid-1', language: 'en', title: 'Web Design', description: 'Design services' }
];

const mockRegister = vi.fn().mockReturnValue({
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
  name: 'test'
});

const defaultProps = {
  register: mockRegister,
  errors: {} as any,
  fields: mockFields as any,
  appendTranslation: vi.fn(),
  removeTranslation: vi.fn(),
  imagePreview: null,
  isSubmitting: false,
  globalError: null,
  handleFileChange: vi.fn(),
  onSubmitAction: vi.fn((e) => e.preventDefault()),
  submitButtonText: 'Save Service'
};

describe('ServiceForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form and its elements correctly', () => {
    render(<ServiceForm {...defaultProps} />);

    expect(screen.getByText('Translations & Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Service' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Add Language' })).toBeInTheDocument();
    expect(screen.getByTestId('image-selector')).toBeInTheDocument();
  });

  it('should display an error message if globalError prop is provided', () => {
    render(<ServiceForm {...defaultProps} globalError="An unexpected error occurred" />);

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('should disable the submit button and change text when isSubmitting is true', () => {
    render(<ServiceForm {...defaultProps} isSubmitting={true} submitButtonText="Saving..." />);

    const submitButton = screen.getByRole('button', { name: 'Saving...' });
    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmitAction when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<ServiceForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Save Service' });
    await user.click(submitButton);

    expect(defaultProps.onSubmitAction).toHaveBeenCalledTimes(1);
  });

  it('should call appendTranslation when add language button is clicked', async () => {
    const user = userEvent.setup();
    render(<ServiceForm {...defaultProps} />);

    const addLanguageButton = screen.getByRole('button', { name: '+ Add Language' });
    await user.click(addLanguageButton);

    expect(defaultProps.appendTranslation).toHaveBeenCalledTimes(1);
  });

  it('should call removeTranslation when the delete button is clicked on secondary translation', async () => {
    const fieldsWithMultiple = [
      ...mockFields,
      { id: 'uuid-2', language: 'pt', title: 'Serviço PT', description: 'Descrição PT' }
    ];

    const user = userEvent.setup();
    render(<ServiceForm {...defaultProps} fields={fieldsWithMultiple as any} />);

    const removeButtons = screen.getAllByRole('button', { name: '✕' });
    await user.click(removeButtons[0]);

    expect(defaultProps.removeTranslation).toHaveBeenCalledTimes(1);
    expect(defaultProps.removeTranslation).toHaveBeenCalledWith(1);
  });

  it('should render link error and apply error class to textarea when errors exist', () => {
    const mockErrors = {
      link: { message: 'invalid_url', type: 'pattern' },
      translations: [{ description: { message: 'desc_required', type: 'required' } }]
    };

    render(<ServiceForm {...defaultProps} errors={mockErrors as any} />);

    expect(screen.getByText('invalid_url')).toBeInTheDocument();

    expect(screen.getByText('desc_required')).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(/Describe the service/i);
    expect(textarea.className).toContain('border-red-500');
  });

  it('should apply default border class when no error exists', () => {
    render(<ServiceForm {...defaultProps} errors={{}} />);

    const textarea = screen.getByPlaceholderText(/Describe the service/i);
    expect(textarea.className).not.toContain('border-red-500');
    expect(textarea.className).toContain('border-zinc-200');
  });

  it('should NOT render error messages when fields are valid', () => {
    render(<ServiceForm {...defaultProps} errors={{}} />);

    expect(screen.queryByText('errors.invalid_url')).not.toBeInTheDocument();
    expect(screen.queryByText('errors.required')).not.toBeInTheDocument();
  });
});
