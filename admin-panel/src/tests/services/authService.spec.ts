import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '@/services/authService';

describe('AuthService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call me endpoint and return parsed JSON', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockResponse = {
      ok: true,
      json: async () => mockUser,
    };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(mockResponse as Response);

    const result = await AuthService.me();

    expect(fetchSpy).toHaveBeenCalledWith('/auth/me', { credentials: 'include' });
    expect(result).toEqual(mockUser);
  });

  it('should call login endpoint with correct request options', async () => {
    const mockPayload = { email: 'test@example.com', password: 'password' };
    const mockResponse = {
      ok: true,
      json: async () => ({ success: true }),
    };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(mockResponse as Response);

    const result = await AuthService.login(mockPayload);

    expect(fetchSpy).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(mockPayload)
    });
    expect(result).toEqual({ success: true });
  });

  it('should call logout endpoint and return response', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ message: 'logged out' }),
    };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(mockResponse as Response);

    const result = await AuthService.logout();

    expect(fetchSpy).toHaveBeenCalledWith('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    expect(result).toEqual({ message: 'logged out' });
  });
});
