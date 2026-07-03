import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/LoginForm';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key
  })
}));

vi.mock('@/components/Input', () => ({
  default: React.forwardRef(({ label, children, ...props }: any, ref: any) => (
    <div data-testid="input-wrapper">
      <input aria-label={label} {...props} ref={ref} />
      {children}
    </div>
  ))
}));

vi.mock('@/components/ErrorAlert', () => ({
  default: ({ message }: { message: string }) => <div role="alert">{message}</div>
}));

const mockRegister = vi.fn().mockReturnValue({
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
  name: 'test'
});

const mockHandleSubmit = vi.fn((fn) => (e: any) => fn(e));

const defaultProps = {
  register: mockRegister,
  handleSubmit: mockHandleSubmit,
  errors: {},
  onSubmit: vi.fn(),
  globalError: null,
  isSubmitting: false
};

describe('LoginForm', () => {
  it('should render input fields and submit button correctly', () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Access Panel' })).toBeInTheDocument();
  });

  it('should display globalError when provided', () => {
    render(<LoginForm {...defaultProps} globalError="Invalid credentials" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('should display specific field errors when provided', () => {
    const errors = {
      email: { message: 'login.error.email', type: 'required' }
    };
    render(<LoginForm {...defaultProps} errors={errors as any} />);

    expect(screen.getByText('login.error.email')).toBeInTheDocument();
  });

  it('should show loading state when isSubmitting is true', () => {
    render(<LoginForm {...defaultProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: 'Signing in' });
    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmit when valid form is submitted', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<LoginForm {...defaultProps} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Access Panel' });
    await user.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should display specific field errors when provided', () => {
    const errors = {
      email: { message: 'login.error.email', type: 'required' },
      password: { message: 'login.error.password', type: 'required' }
    };

    render(<LoginForm {...defaultProps} errors={errors as any} />);

    expect(screen.getByText('login.error.email')).toBeInTheDocument();
    expect(screen.getByText('login.error.password')).toBeInTheDocument(); // Verificamos se ele renderiza
  });
});
