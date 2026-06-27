export const UserService = {
  async updateProfile(payload: Partial<User>): Promise<User> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar perfil.');
    }

    return data;
  },

  async updatePassword(payload: Pick<PasswordForm, 'oldPassword' | 'newPassword'>): Promise<User> {
    const res = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao alterar a senha.');
    }

    return data;
  }
};
