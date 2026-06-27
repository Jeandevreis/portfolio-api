import { Context } from 'hono';
import * as bcrypt from 'bcryptjs';

import {
  findUserById,
  updateUserProfile,
  updateUserPassword
} from '../repositories/users.repository.js';

import { updateProfileSchema, changePasswordSchema } from '../schemas/users.schema.js';

export const getProfile = async (c: Context) => {
  try {
    const payload = c.get('jwtPayload');
    const user = await findUserById(payload.id);

    if (!user) return c.json({
      error: 'users.error.not_found', message: 'User not found'
    }, 404);

    const { passwordHash, lockUntil, loginAttempts, ...safeUser } = user;

    return c.json(safeUser, 200);

  } catch (error: any) {
    return c.json({ error: 'users.error.get_profile', message: error.message }, 500);
  }
};

export const updateProfile = async (c: Context) => {
  try {
    const payload = c.get('jwtPayload');

    const profileData = updateProfileSchema.parse(await c.req.json());

    const updatedUser = await updateUserProfile(payload.id, profileData);

    if (!updatedUser) return c.json({
      error: 'users.error.update', message: 'Profile not updated'
    }, 422);

    const { passwordHash, lockUntil, loginAttempts, ...safeUser } = updatedUser;

    return c.json(safeUser, 200);

  } catch (error: any) {
    if (error.code === '23505') {
      return c.json({
        error: 'users.error.email_in_use', message: 'Email already in use'
      }, 409);
    }

    return c.json({ error: 'users.error.update', message: error.message }, 500);
  }
};

export const changePassword = async (c: Context) => {
  try {
    const payload = c.get('jwtPayload');

    const { oldPassword, newPassword } = changePasswordSchema.parse(await c.req.json());

    const user = await findUserById(payload.id);

    if (!user) return c.json({
      error: 'users.error.not_found', message: 'User not found'
    }, 404);

    const passwordValid = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!passwordValid) return c.json({
      error: 'users.error.invalid_password', message: 'A senha atual está incorreta'
    }, 401);

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await updateUserPassword(payload.id, newPasswordHash);

    if (!updatedUser) return c.json({
      error: 'users.error.update_password', message: 'Password not updated'
    }, 422);

    return c.json({ message: 'Senha atualizada com sucesso' }, 200);

  } catch (error: any) {
    return c.json({ error: 'users.error.change_password', message: error.message }, 500);
  }
};
