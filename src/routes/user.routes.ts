import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.js';
import {
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/user.controller.js';

import { zValidator } from '@hono/zod-validator';
import { changePasswordSchema, updateProfileSchema } from '../schemas/users.schema.js';

const userRoutes = new Hono();

userRoutes.get('/profile', authMiddleware, getProfile);
userRoutes.put('/profile', authMiddleware, zValidator('json', updateProfileSchema), updateProfile);
userRoutes.put('/password', authMiddleware, zValidator('json', changePasswordSchema), changePassword);

export default userRoutes;
