import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Settings from '@/pages/Settings';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { useSettings } from '@/hooks/useSettings';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
}));

vi.mock('@/contexts/SettingsContext', () => ({
  useSettingsContext: vi.fn(),
}));

vi.mock('@/hooks/useSettings', () => ({
  useSettings: vi.fn(),
}));

vi.mock('@/components/Background', () => ({
  default: () => <div data-testid="mock-background" />
}));

vi.mock('@/components/SettingsForm', () => ({
  default: ({ submitButtonText, onSubmitAction, globalError, isSubmitting }: any) => (
    <form
      data-testid="mock-settings-form"
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

describe('Settings Page Component', () => {
  const mockApplyNewSettings = vi.fn();
  const mockReset = vi.fn();
  const mockSetImagePreview = vi.fn();
  const mockUpdateSettingsSubmit = vi.fn();
  const mockUpdateSettings = vi.fn().mockImplementation((callback) => {
    return () => {
      callback({ siteUrl: 'https://new-url.com' });
      mockUpdateSettingsSubmit();
    };
  });

  const mockGlobalSettings = {
    siteUrl: 'https://example.com',
    publicEmail: 'admin@example.com',
    logoUrl: 'https://example.com/logo.png',
    customConfig: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSettingsContext).mockReturnValue({
      globalSettings: mockGlobalSettings,
      isLoadingSettings: false,
      applyNewSettings: mockApplyNewSettings,
    } as any);

    vi.mocked(useSettings).mockReturnValue({
      register: vi.fn() as any,
      errors: {},
      isSubmitting: false,
      globalError: null,
      updateSettings: mockUpdateSettings,
      imagePreview: null,
      handleFileChange: vi.fn(),
      reset: mockReset,
      setImagePreview: mockSetImagePreview,
    } as any);
  });

  it('should render loading spinner when isLoadingSettings is true', () => {
    vi.mocked(useSettingsContext).mockReturnValue({
      globalSettings: null,
      isLoadingSettings: true,
      applyNewSettings: mockApplyNewSettings,
    } as any);

    const { container } = render(<Settings />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('should render Layout, headers, background, back link and SettingsForm correctly when loaded', () => {
    render(<Settings />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage the panel settings.')).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/panel');
    expect(link).toHaveTextContent('Back to panel');

    expect(screen.getByTestId('mock-settings-form')).toBeInTheDocument();
  });

  it('should reset form values and image preview when globalSettings is loaded/changed', () => {
    render(<Settings />);

    expect(mockReset).toHaveBeenCalledWith({
      ...mockGlobalSettings,
      customConfig: {},
      siteUrl: 'https://example.com',
      publicEmail: 'admin@example.com',
      logoUrl: 'https://example.com/logo.png',
    });
    expect(mockSetImagePreview).toHaveBeenCalledWith('https://example.com/logo.png');
  });

  it('should trigger updateSettings submit action and apply new settings on form submit', () => {
    render(<Settings />);

    const form = screen.getByTestId('mock-settings-form');
    fireEvent.submit(form);

    expect(mockUpdateSettingsSubmit).toHaveBeenCalledTimes(1);
    expect(mockApplyNewSettings).toHaveBeenCalledWith({ siteUrl: 'https://new-url.com' });
  });
});
