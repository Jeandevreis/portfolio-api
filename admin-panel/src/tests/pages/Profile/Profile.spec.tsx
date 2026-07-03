import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Profile from '@/pages/Profile';
import { useProfile } from '@/hooks/useProfile';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
}));

vi.mock('@/hooks/useProfile', () => ({
  useProfile: vi.fn(),
}));

vi.mock('@/components/Background', () => ({
  default: () => <div data-testid="mock-background" />
}));

vi.mock('@/components/IconWrapper', () => ({
  default: ({ children }: any) => <span data-testid="mock-icon">{children}</span>
}));

vi.mock('@/components/ImageSelector', () => ({
  default: ({ imagePreview }: any) => <div data-testid="mock-image-selector">{imagePreview}</div>
}));

vi.mock('@/components/Input', () => ({
  default: React.forwardRef(({ id, label, placeholder, children, ...rest }: any, ref: any) => (
    <div data-testid={`mock-input-container-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input ref={ref} id={id} placeholder={placeholder} {...rest} />
      {children}
    </div>
  ))
}));

describe('Profile Page Component', () => {
  const mockUpdateProfileSubmit = vi.fn((e) => e.preventDefault());
  const mockUpdatePasswordSubmit = vi.fn((e) => e.preventDefault());

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProfile).mockReturnValue({
      profileRegister: vi.fn().mockReturnValue({}),
      profileErrors: {},
      isSubmittingProfile: false,
      updateProfileSubmit: mockUpdateProfileSubmit,
      globalErrorProfile: null,
      successProfile: false,
      passwordRegister: vi.fn().mockReturnValue({}),
      passwordErrors: {},
      isSubmittingPassword: false,
      updatePasswordSubmit: mockUpdatePasswordSubmit,
      globalErrorPassword: null,
      successPassword: false,
      imagePreview: null,
      handleFileChange: vi.fn(),
      loading: false,
    } as any);
  });

  it('should render loading spinner when loading is true', () => {
    vi.mocked(useProfile).mockReturnValue({
      ...vi.mocked(useProfile)(),
      loading: true,
    } as any);

    const { container } = render(<Profile />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText('Meu Perfil')).not.toBeInTheDocument();
  });

  it('should render profile layout, headers, inputs, and forms correctly when loaded', () => {
    render(<Profile />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Manage your account information and security.')).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/panel');
    expect(link).toHaveTextContent('Back to Dashboard');

    expect(screen.getByTestId('mock-input-container-name')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-container-email')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-container-oldPassword')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-container-newPassword')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-container-confirmPassword')).toBeInTheDocument();
  });

  it('should trigger updateProfileSubmit when the personal info form is submitted', () => {
    render(<Profile />);

    const forms = document.querySelectorAll('form');
    // The first form is the personal info form
    fireEvent.submit(forms[0]);

    expect(mockUpdateProfileSubmit).toHaveBeenCalledTimes(1);
  });

  it('should trigger updatePasswordSubmit when the security form is submitted', () => {
    render(<Profile />);

    const forms = document.querySelectorAll('form');
    // The second form is the security / password form
    fireEvent.submit(forms[1]);

    expect(mockUpdatePasswordSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display error and success messages properly', () => {
    vi.mocked(useProfile).mockReturnValue({
      ...vi.mocked(useProfile)(),
      globalErrorProfile: 'Error updating profile',
      successProfile: true,
      globalErrorPassword: 'Error updating password',
      successPassword: true,
    } as any);

    render(<Profile />);

    expect(screen.getByText('Error updating profile')).toBeInTheDocument();
    expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    expect(screen.getByText('Error updating password')).toBeInTheDocument();
    expect(screen.getByText('Password updated successfully')).toBeInTheDocument();
  });
});
