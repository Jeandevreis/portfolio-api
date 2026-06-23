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
  default: ({ label, value, onChange, name, placeholder }: any) => (
    <input aria-label={label} name={name} value={value} onChange={onChange} placeholder={placeholder} />
  )
}));

vi.mock('@/components/Select', () => ({
  default: ({ label, value, onChange }: any) => (
    <select aria-label={label} value={value} onChange={onChange}>
      <option value={value}>{value}</option>
    </select>
  )
}));

vi.mock('@/components/ImageSelector', () => ({
  default: () => <div data-testid="image-selector" />
}));

vi.mock('@/components/IconWrapper', () => ({
  default: ({ children }: any) => <span>{children}</span>
}));

const mockForm = {
  type: 'course',
  status: 'completed',
  startDate: '2023-01-01',
  endDate: '2023-02-01',
  durationHours: 40,
  certificateUrl: 'https://example.com/cert',
  translations: [
    { language: 'en', institution: 'Tech Inst', name: 'React Course', description: 'Advanced React' }
  ]
};

const mockProps = {
  form: mockForm as any,
  setForm: vi.fn(),
  imagePreview: null,
  submitting: false,
  error: null,
  handleFileChange: vi.fn(),
  updateTranslation: vi.fn(),
  addTranslation: vi.fn(),
  removeTranslation: vi.fn(),
  onSubmitAction: vi.fn((e) => e.preventDefault())
};

describe('EducationForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form and its elements correctly', () => {
    render(<EducationForm {...mockProps} />);

    expect(screen.getByText('educations.form.titles.translations')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'educations.form.buttons.save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'educations.form.buttons.addLanguage' })).toBeInTheDocument();

    expect(screen.getByDisplayValue('Tech Inst')).toBeInTheDocument();
    expect(screen.getByDisplayValue('React Course')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Advanced React')).toBeInTheDocument();
    expect(screen.getByTestId('image-selector')).toBeInTheDocument();
  });

  it('should display an error message if error prop is provided', () => {
    render(<EducationForm {...mockProps} error="An unexpected error occurred" />);

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('should disable the submit button and change text when submitting is true', () => {
    render(<EducationForm {...mockProps} submitting={true} />);

    const submitButton = screen.getByRole('button', { name: 'educations.form.buttons.saving' });

    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmitAction when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<EducationForm {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: 'educations.form.buttons.save' });
    await user.click(submitButton);

    expect(mockProps.onSubmitAction).toHaveBeenCalledTimes(1);
  });

  it('should call addTranslation when add language button is clicked', async () => {
    const user = userEvent.setup();
    render(<EducationForm {...mockProps} />);

    const addLanguageButton = screen.getByRole('button', { name: 'educations.form.buttons.addLanguage' });
    await user.click(addLanguageButton);

    expect(mockProps.addTranslation).toHaveBeenCalledTimes(1);
  });

  it('should call removeTranslation when the remove button is clicked on secondary translation', async () => {
    const formWithMultipleTranslations = {
      ...mockForm,
      translations: [
        ...mockForm.translations,
        { language: 'pt', institution: 'Inst PT', name: 'Curso React', description: 'React Avançado' }
      ]
    };

    const user = userEvent.setup();
    render(<EducationForm {...mockProps} form={formWithMultipleTranslations} />);

    const removeButton = screen.getByText('✕');
    await user.click(removeButton);

    expect(mockProps.removeTranslation).toHaveBeenCalledTimes(1);
    expect(mockProps.removeTranslation).toHaveBeenCalledWith(1);
  });

  it('should call updateTranslation when a translation field is changed', async () => {
    const user = userEvent.setup();
    render(<EducationForm {...mockProps} />);

    const descriptionTextarea = screen.getByPlaceholderText('educations.form.placeholders.description');
    await user.type(descriptionTextarea, ' test');

    expect(mockProps.updateTranslation).toHaveBeenCalled();
  });
});
