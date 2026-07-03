/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsService } from '@/services/settingsService';

describe('SettingsService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call get and return settings', async () => {
    const mockData = { theme: 'dark', panelLanguage: 'en' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await SettingsService.get();

    expect(fetchSpy).toHaveBeenCalledWith('/api/settings', { credentials: 'include' });
    expect(result).toEqual(mockData);
  });

  it('should call update with PUT method and return updated settings', async () => {
    const mockPayload = { theme: 'light' };
    const mockData = { theme: 'light', panelLanguage: 'en' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await SettingsService.update(mockPayload as any);

    expect(fetchSpy).toHaveBeenCalledWith('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(mockPayload)
    });
    expect(result).toEqual(mockData);
  });
});
