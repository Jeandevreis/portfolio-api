import { handleResponse } from "@/helpers/fetchHelpers";

export const UserService = {
  async updateProfile(payload: Partial<User>): Promise<User> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    return handleResponse(res);
  },

  async updatePassword(payload: Pick<PasswordForm, 'oldPassword' | 'newPassword'>): Promise<User> {
    const res = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    return handleResponse(res);
  }
};
