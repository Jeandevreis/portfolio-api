import { Hono } from 'hono';
import { login, logout, me } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

import { zValidator } from '@hono/zod-validator';
import { loginSchema } from '../schemas/auth.schema.js';

const auth = new Hono();

auth.post('/login', zValidator('json', loginSchema), login);
auth.post('/logout', logout);
auth.get('/me', authMiddleware, me);

export default auth;
