import { handleResponse } from '@/helpers/fetchHelpers';

export const EducationService = {
  async getAll(): Promise<Education[]> {
    const res = await fetch("/api/educations", { credentials: "include" });
    return handleResponse(res);
  },

  async getById(id: string): Promise<Education> {
    const res = await fetch(`/api/educations/${id}`, { credentials: "include" });
    return handleResponse(res);
  },

  async create(payload: Partial<Education>): Promise<Education> {
    const res = await fetch('/api/educations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async update(id: string, payload: Partial<Education>): Promise<Education> {
    const res = await fetch(`/api/educations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/educations/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(res);
  }
};