import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

import EducationForm from '@/components/EducationForm';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

vi.mock('@/components/Input', () => ({
  default: React.forwardRef(({ label, name, placeholder, onChange, onBlur }: any, ref: any) => (
    <input aria-label={label} name={name} placeholder={placeholder} onChange={onChange} onBlur={onBlur} ref={ref} />
  ))
}));

vi.mock('@/components/Select', () => ({
  default: React.forwardRef(({ label, name, onChange, onBlur }: any, ref: any) => (
    <select aria-label={label} name={name} onChange={onChange} onBlur={onBlur} ref={ref}>
      <option value="">Select</option>
    </select>
  ))
}));

vi.mock('@/components/ImageSelector', () => ({
  default: () => <div data-testid="image-selector" />
}));

vi.mock('@/components/IconWrapper', () => ({
  default: ({ children }: any) => <span>{children}</span>
}));

const mockFields = [
  { id: 'uuid-1', language: 'en', institution: 'Tech Inst', name: 'React Course', description: 'Advanced React' }
];

const mockRegister = vi.fn((name) => ({
  name,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn()
}));

const mockProps = {
  register: mockRegister,
  errors: {},
  fields: mockFields as any,
  appendTranslation: vi.fn(),
  removeTranslation: vi.fn(),
  imagePreview: null,
  isSubmitting: false,
  globalError: null,
  handleFileChange: vi.fn(),
  onSubmitAction: vi.fn((e) => e.preventDefault()),
  submitButtonText: 'educations.form.buttons.save'
};

describe('EducationForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form and its elements correctly', () => {
    render(<EducationForm {...mockProps} />);

    expect(screen.getByText('educations.form.titles.translations')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'educations.form.buttons.save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'buttons.add_language' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('educations.form.placeholders.institution')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('educations.form.placeholders.course_name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('educations.form.placeholders.description')).toBeInTheDocument();
    expect(screen.getByTestId('image-selector')).toBeInTheDocument();
  });

  it('should display an error message if globalError prop is provided', () => {
    render(<EducationForm {...mockProps} globalError="An unexpected error occurred" />);

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('should disable the submit button and change text when isSubmitting is true', () => {
    render(<EducationForm {...mockProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: 'buttons.saving' });

    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmitAction when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<EducationForm {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: 'educations.form.buttons.save' });
    await user.click(submitButton);

    expect(mockProps.onSubmitAction).toHaveBeenCalledTimes(1);
  });

  it('should call appendTranslation when add language button is clicked', async () => {
    const user = userEvent.setup();
    render(<EducationForm {...mockProps} />);

    const addLanguageButton = screen.getByRole('button', { name: 'buttons.add_language' }); await user.click(addLanguageButton);

    expect(mockProps.appendTranslation).toHaveBeenCalledTimes(1);
  });

  it('should call removeTranslation when the remove button is clicked on secondary translation', async () => {
    const fieldsWithMultipleTranslations = [
      ...mockFields,
      { id: 'uuid-2', language: 'pt', institution: 'Inst PT', name: 'Curso React', description: 'React Avançado' }
    ];

    const user = userEvent.setup();
    render(<EducationForm {...mockProps} fields={fieldsWithMultipleTranslations as any} />);

    const removeButton = screen.getByRole('button', { name: 'buttons.delete' });
    await user.click(removeButton);

    expect(mockProps.removeTranslation).toHaveBeenCalledTimes(1);
    expect(mockProps.removeTranslation).toHaveBeenCalledWith(1);
  });

  it('should register form fields correctly via React Hook Form', () => {
    render(<EducationForm {...mockProps} />);

    expect(mockRegister).toHaveBeenCalledWith('type');
    expect(mockRegister).toHaveBeenCalledWith('status');
    expect(mockRegister).toHaveBeenCalledWith('durationHours');
    expect(mockRegister).toHaveBeenCalledWith('translations.0.language');
    expect(mockRegister).toHaveBeenCalledWith('translations.0.institution');
  });

  it('should display validation error messages for all fields when errors exist', () => {
    const mockErrors = {
      type: { message: 'Error in type' },
      status: { message: 'Error in status' },
      startDate: { message: 'Error in startDate' },
      endDate: { message: 'Error in endDate' },
      durationHours: { message: 'Error in durationHours' },
      certificateUrl: { message: 'Error in certificateUrl' },
      translations: [
        {
          language: { message: 'Error in language' },
          institution: { message: 'Error in institution' },
          name: { message: 'Error in name' },
          description: { message: 'Error in description' },
        }
      ]
    };

    render(<EducationForm {...mockProps} errors={mockErrors as any} />);

    expect(screen.getByText('Error in type')).toBeInTheDocument();
    expect(screen.getByText('Error in status')).toBeInTheDocument();
    expect(screen.getByText('Error in startDate')).toBeInTheDocument();
    expect(screen.getByText('Error in endDate')).toBeInTheDocument();
    expect(screen.getByText('Error in durationHours')).toBeInTheDocument();
    expect(screen.getByText('Error in certificateUrl')).toBeInTheDocument();

    expect(screen.getByText('Error in language')).toBeInTheDocument();
    expect(screen.getByText('Error in institution')).toBeInTheDocument();
    expect(screen.getByText('Error in name')).toBeInTheDocument();
    expect(screen.getByText('Error in description')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText('educations.form.placeholders.description');
    expect(textarea.className).toContain('border-red-500');
    expect(textarea.className).toContain('bg-red-50');
  });
});
