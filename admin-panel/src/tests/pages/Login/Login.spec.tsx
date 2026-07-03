import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Login from '@/pages/Login';
import { useAuth } from '@/contexts/AuthContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/components/FullScreenLoader', () => ({
  default: () => <div data-testid="mock-loader" />
}));

vi.mock('@/components/WelcomePanel', () => ({
  default: () => <div data-testid="mock-welcome-panel" />
}));

vi.mock('@/components/LoginForm', () => ({
  default: ({ onSubmit, globalError, isSubmitting }: any) => (
    <form
      data-testid="mock-login-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email: 'test@example.com', password: 'password123' });
      }}
    >
      <span data-testid="form-global-error">{globalError}</span>
      <span data-testid="form-is-submitting">{isSubmitting ? 'submitting' : 'idle'}</span>
      <button type="submit" data-testid="form-submit-btn">Login</button>
    </form>
  )
}));

describe('Login Page Component', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      checkingAuth: false,
      isAuthenticated: false,
      login: mockLogin,
    } as any);
  });

  it('should render FullScreenLoader when checkingAuth is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      checkingAuth: true,
      isAuthenticated: false,
      login: mockLogin,
    } as any);

    render(<Login />);

    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-welcome-panel')).not.toBeInTheDocument();
  });

  it('should redirect to /panel if user is already authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      checkingAuth: false,
      isAuthenticated: true,
      login: mockLogin,
    } as any);

    render(<Login />);

    expect(mockNavigate).toHaveBeenCalledWith('/panel', { replace: true });
  });

  it('should render WelcomePanel, form, and header titles correctly when not checking auth and not authenticated', () => {
    render(<Login />);

    expect(screen.getByTestId('mock-welcome-panel')).toBeInTheDocument();
    expect(screen.getByTestId('mock-login-form')).toBeInTheDocument();

    // Verify presence of title strings (default fallback values or key)
    expect(screen.getByText('Admin Access')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('should call login function when form is submitted', async () => {
    render(<Login />);

    const form = screen.getByTestId('mock-login-form');
    fireEvent.submit(form);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
