/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '@/services/userService';

describe('UserService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call updateProfile with PUT method and return updated user', async () => {
    const mockPayload = { name: 'Jane Doe' };
    const mockData = { id: '1', ...mockPayload, email: 'jane@example.com' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await UserService.updateProfile(mockPayload as any);

    expect(fetchSpy).toHaveBeenCalledWith('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(mockPayload)
    });
    expect(result).toEqual(mockData);
  });

  it('should call updatePassword with PUT method and return user response', async () => {
    const mockPayload = { oldPassword: 'old', newPassword: 'new' };
    const mockData = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await UserService.updatePassword(mockPayload);

    expect(fetchSpy).toHaveBeenCalledWith('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(mockPayload)
    });
    expect(result).toEqual(mockData);
  });
});
