import { Hono } from 'hono';
import { cronMiddleware } from '../middlewares/cron.js';
import { authMiddleware } from '../middlewares/auth.js';
import { previewGithubData, syncGithubData } from '../controllers/github.controller.js';

import { zValidator } from '@hono/zod-validator';
import { githubSchema } from '../schemas/github.schema.js';

const github = new Hono();

github.get('/cron/sync', cronMiddleware, syncGithubData);
github.post('/sync', cronMiddleware, syncGithubData);
github.post('/preview', authMiddleware, zValidator('json', githubSchema), previewGithubData);

export default github;
