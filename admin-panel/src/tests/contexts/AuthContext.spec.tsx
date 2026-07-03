import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/services/authService';

vi.mock('@/services/authService', () => ({
  AuthService: {
    me: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  }
}));

const TestConsumer = () => {
  const { user, login, logout, isAuthenticated, checkingAuth } = useAuth();
  return (
    <div>
      <div data-testid="user">{user?.name || 'Guest'}</div>
      <div data-testid="auth">{isAuthenticated ? 'Authed' : 'Not Authed'}</div>
      <div data-testid="loading">{checkingAuth ? 'Loading' : 'Loaded'}</div>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when useAuth is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    expect(() => render(<TestConsumer />)).toThrow('useAuth deve ser usado dentro de um AuthProvider');

    consoleSpy.mockRestore();
  });

  it('should initialize and check auth on mount (success)', async () => {
    vi.mocked(AuthService.me).mockResolvedValue({ id: '1', name: 'John Doe', email: 'j@j.com', avatarUrl: null });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('auth')).toHaveTextContent('Authed');
      expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
    });
  });

  it('should handle auth failure on mount', async () => {
    vi.mocked(AuthService.me).mockRejectedValue(new Error('Unauthorized'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Guest');
      expect(screen.getByTestId('auth')).toHaveTextContent('Not Authed');
    });
  });

  it('should handle login flow', async () => {
    vi.mocked(AuthService.me).mockResolvedValue({ id: '1', name: 'John', email: 'j@j.com', avatarUrl: null });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
      expect(screen.getByTestId('user')).toHaveTextContent('John');
    });
  });

  it('should handle logout flow', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    await waitFor(() => {
      expect(AuthService.logout).toHaveBeenCalled();
      expect(screen.getByTestId('auth')).toHaveTextContent('Not Authed');
    });
  });
});
