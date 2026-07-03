/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectService } from '@/services/projectService';

describe('ProjectService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call getAll and return projects array', async () => {
    const mockData = [{ id: '1', title: 'Project 1' }];
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await ProjectService.getAll();

    expect(fetchSpy).toHaveBeenCalledWith('/api/projects', { credentials: 'include' });
    expect(result).toEqual(mockData);
  });

  it('should call getById and return project details', async () => {
    const mockData = { id: '123', title: 'Project 1' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await ProjectService.getById('123');

    expect(fetchSpy).toHaveBeenCalledWith('/api/projects/123', { credentials: 'include' });
    expect(result).toEqual(mockData);
  });

  it('should call create with POST method and return created project', async () => {
    const mockPayload = { title: 'New Project' };
    const mockData = { id: '123', ...mockPayload };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await ProjectService.create(mockPayload as any);

    expect(fetchSpy).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(mockPayload)
    });
    expect(result).toEqual(mockData);
  });

  it('should call update with PUT method and return updated project', async () => {
    const mockPayload = { title: 'Updated Project' };
    const mockData = { id: '123', ...mockPayload };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const result = await ProjectService.update('123', mockPayload as any);

    expect(fetchSpy).toHaveBeenCalledWith('/api/projects/123', {
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

    const result = await ProjectService.delete('123');

    expect(fetchSpy).toHaveBeenCalledWith('/api/projects/123', {
      method: 'DELETE',
      credentials: 'include'
    });
    expect(result).toEqual(mockResponse);
  });
});
