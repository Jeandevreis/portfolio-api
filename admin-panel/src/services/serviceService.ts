import { handleResponse } from '@/helpers/fetchHelpers';

export const ServiceService = {
  async getAll(): Promise<Service[]> {
    const res = await fetch('/api/services', { credentials: 'include' });
    return handleResponse(res);
  },

  async getById(id: string): Promise<Service> {
    const res = await fetch(`/api/services/${id}`, { credentials: 'include' });
    return handleResponse(res);
  },

  async create(payload: Partial<Service>): Promise<Service> {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async update(id: string, payload: Partial<Service>): Promise<Service> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(res);
  }
};
