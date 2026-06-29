import { handleResponse } from '@/helpers/fetchHelpers';

export const AuthService = {
  async me() {
    const res = await fetch('/auth/me', { credentials: 'include' });
    return handleResponse(res);
  },

  async login(payload: { email: string; password: string }) {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async logout() {
    const res = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(res);
  }
};