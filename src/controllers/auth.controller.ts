import { Context } from 'hono';
import { sign } from 'hono/jwt';
import { setCookie, deleteCookie } from 'hono/cookie';

import * as bcrypt from 'bcryptjs';

import { loginSchema } from '../schemas/auth.schema.js';

import {
  findUserByEmail,
  updateLoginAttempts,
  resetLoginAttempts,
  findUserById
} from '../repositories/users.repository.js';

export const login = async (c: Context) => {
  const { email, password } = loginSchema.parse(await c.req.json());

  const user = await findUserByEmail(email);
  if (!user) return c.json({ error: 'login.error.credentials', message: 'Invalid credentials' }, 401);

  if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
    return c.json({ error: 'login.error.locked', message: 'Account temporarily locked' }, 429);
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    const attempts = user.loginAttempts + 1;
    let lockUntil = user.lockUntil;

    if (attempts >= 5) {
      lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    await updateLoginAttempts(user.id, attempts >= 5 ? 0 : attempts, lockUntil);

    return c.json({ error: 'login.error.credentials', message: 'Invalid credentials' }, 401);
  }

  await resetLoginAttempts(user.id);

  const token = await sign({
    id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
  }, process.env.JWT_SECRET!);

  setCookie(c, 'auth_token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return c.json({ success: true, message: 'Logged in' });
};

export const logout = async (c: Context) => {
  deleteCookie(c, 'auth_token', {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });

  return c.json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const me = async (c: Context) => {
  const payload = c.get('jwtPayload');

  const user = await findUserById(payload.id);

  if (!user) {
    return c.json({ error: 'auth.error.userNotFound', message: 'User not found' }, 404);
  }

  const { passwordHash, lockUntil, loginAttempts, ...safeUser } = user;

  return c.json(safeUser);
};
