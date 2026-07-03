import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ProjectForm from '@/components/ProjectForm';

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
  default: React.forwardRef(({ label, ...props }: any, ref: any) => (
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
  { id: 'uuid-1', language: 'en', title: 'React Project', description: 'Advanced Project' }
];

const mockRegister = vi.fn().mockReturnValue({
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
  name: 'test'
});

const mockProps = {
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
  submitButtonText: 'projects.form.buttons.save_project'
};

describe('ProjectForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form and its elements correctly', () => {
    render(<ProjectForm {...mockProps} />);

    expect(screen.getByText('Content & Translations')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'projects.form.buttons.save_project' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Add Language' })).toBeInTheDocument();
    expect(screen.getByTestId('image-selector')).toBeInTheDocument();
  });

  it('should display an error message if globalError prop is provided', () => {
    render(<ProjectForm {...mockProps} globalError="An unexpected error occurred" />);

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('should disable the submit button and change text when isSubmitting is true', () => {
    render(<ProjectForm {...mockProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: 'Saving...' });
    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmitAction when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<ProjectForm {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: 'projects.form.buttons.save_project' });
    await user.click(submitButton);

    expect(mockProps.onSubmitAction).toHaveBeenCalledTimes(1);
  });

  it('should call appendTranslation when add language button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProjectForm {...mockProps} />);

    const addLanguageButton = screen.getByRole('button', { name: '+ Add Language' });
    await user.click(addLanguageButton);

    expect(mockProps.appendTranslation).toHaveBeenCalledTimes(1);
  });

  it('should call removeTranslation when the delete button is clicked on secondary translation', async () => {
    const fieldsWithMultiple = [
      ...mockFields,
      { id: 'uuid-2', language: 'pt', title: 'Projeto PT', description: 'Descrição PT' }
    ];

    const user = userEvent.setup();
    render(<ProjectForm {...mockProps} fields={fieldsWithMultiple as any} />);

    const removeButtons = screen.getAllByTitle('Delete');
    await user.click(removeButtons[0]);

    expect(mockProps.removeTranslation).toHaveBeenCalledTimes(1);
    expect(mockProps.removeTranslation).toHaveBeenCalledWith(1);
  });

  it('should render field errors when provided', () => {
    const mockErrors = {
      liveUrl: { message: 'errors.invalid_url', type: 'pattern' },
      repoUrl: { message: 'errors.invalid_url', type: 'pattern' }
    };

    render(<ProjectForm {...mockProps} errors={mockErrors as any} />);

    const errorMessages = screen.getAllByText('errors.invalid_url');
    expect(errorMessages).toHaveLength(2);
  });

  it('should render translation field errors correctly', () => {
    const mockErrorsWithTranslations = {
      translations: [
        { title: { message: 'errors.required', type: 'required' } }
      ]
    };

    render(<ProjectForm {...mockProps} errors={mockErrorsWithTranslations as any} />);

    expect(screen.getByText('errors.required')).toBeInTheDocument();
  });

  it('should NOT render delete button for the first translation (index 0)', () => {
    render(<ProjectForm {...mockProps} fields={[mockFields[0]] as any} />);

    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument();
  });

  it('should NOT render globalError div when it is null', () => {
    render(<ProjectForm {...mockProps} globalError={null} />);

    const errorDiv = document.querySelector('.bg-red-50');
    expect(errorDiv).not.toBeInTheDocument();
  });

  it('should render the default submit text when not submitting', () => {
    render(<ProjectForm {...mockProps} isSubmitting={false} />);

    expect(screen.getByText('projects.form.buttons.save_project')).toBeInTheDocument();
    expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
  });

  it('should apply default border classes when there is no description error', () => {
    render(<ProjectForm {...mockProps} errors={{}} />);

    const textarea = screen.getByPlaceholderText(/Describe the technologies/i);
    expect(textarea.className).toContain('border-zinc-200');
    expect(textarea.className).not.toContain('border-red-500');
  });

  it('should NOT render error messages when there are no errors in translations', () => {
    render(<ProjectForm {...mockProps} errors={{}} />);

    const errorMessages = screen.queryByText('errors.required'); // ou o texto que você usa
    expect(errorMessages).not.toBeInTheDocument();
  });

  it('should render error messages only for the specific translation field that has an error', () => {
    const mockErrors = {
      translations: [
        { title: { message: 'errors.title_required', type: 'required' } }
      ]
    };

    render(<ProjectForm {...mockProps} errors={mockErrors as any} />);

    expect(screen.getByText('errors.title_required')).toBeInTheDocument();

    expect(screen.queryByText('errors.language_required')).not.toBeInTheDocument();
    expect(screen.queryByText('errors.description_required')).not.toBeInTheDocument();
  });
});
