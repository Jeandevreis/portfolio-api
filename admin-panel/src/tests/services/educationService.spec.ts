/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EducationService } from '@/services/educationService';

describe('EducationService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call getAll and return education array', async () => {
    const mockData = [{ id: '1' }];
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await EducationService.getAll();

    expect(fetchSpy).toHaveBeenCalledWith('/api/educations', { credentials: 'include' });
    expect(result).toEqual(mockData);
  });

  it('should call getById and return education details', async () => {
    const mockData = { id: '123' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await EducationService.getById('123');

    expect(fetchSpy).toHaveBeenCalledWith('/api/educations/123', { credentials: 'include' });
    expect(result).toEqual(mockData);
  });

  it('should call create with POST method and return created education', async () => {
    const mockPayload = { name: 'Degree' };
    const mockData = { id: '123', ...mockPayload };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await EducationService.create(mockPayload as any);

    expect(fetchSpy).toHaveBeenCalledWith('/api/educations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(mockPayload)
    });
    expect(result).toEqual(mockData);
  });

  it('should call update with PUT method and return updated education', async () => {
    const mockPayload = { name: 'Degree updated' };
    const mockData = { id: '123', ...mockPayload };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await EducationService.update('123', mockPayload as any);

    expect(fetchSpy).toHaveBeenCalledWith('/api/educations/123', {
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

    const result = await EducationService.delete('123');

    expect(fetchSpy).toHaveBeenCalledWith('/api/educations/123', {
      method: 'DELETE',
      credentials: 'include'
    });
    expect(result).toEqual(mockResponse);
  });
});
