/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceService } from '@/services/serviceService';

describe('ServiceService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call getAll and return services array', async () => {
    const mockData = [{ id: '1', title: 'Service 1' }];
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await ServiceService.getAll();

    expect(fetchSpy).toHaveBeenCalledWith('/api/services', { credentials: 'include' });
    expect(result).toEqual(mockData);
  });

  it('should call getById and return service details', async () => {
    const mockData = { id: '123', title: 'Service 1' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await ServiceService.getById('123');

    expect(fetchSpy).toHaveBeenCalledWith('/api/services/123', { credentials: 'include' });
    expect(result).toEqual(mockData);
  });

  it('should call create with POST method and return created service', async () => {
    const mockPayload = { title: 'New Service' };
    const mockData = { id: '123', ...mockPayload };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await ServiceService.create(mockPayload as any);

    expect(fetchSpy).toHaveBeenCalledWith('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(mockPayload)
    });
    expect(result).toEqual(mockData);
  });

  it('should call update with PUT method and return updated service', async () => {
    const mockPayload = { title: 'Updated Service' };
    const mockData = { id: '123', ...mockPayload };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await ServiceService.update('123', mockPayload as any);

    expect(fetchSpy).toHaveBeenCalledWith('/api/services/123', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(mockPayload)
    });
    expect(result).toEqual(mockData);
  });

  it('should call delete with DELETE method and return response message', async () => {
    const mockResponse = { message: 'deleted successfully' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await ServiceService.delete('123');

    expect(fetchSpy).toHaveBeenCalledWith('/api/services/123', {
      method: 'DELETE',
      credentials: 'include'
    });
    expect(result).toEqual(mockResponse);
  });
});
