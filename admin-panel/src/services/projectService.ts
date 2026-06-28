import { handleResponse } from '@/helpers/fetchHelpers';

export const ProjectService = {
  async getAll(): Promise<Project[]> {
    const res = await fetch("/api/projects", { credentials: "include" });
    return handleResponse(res);
  },

  async getById(id: string): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, { credentials: "include" });
    return handleResponse(res);
  },

  async create(payload: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async update(id: string, payload: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(res);
  }
};