import { Hono } from 'hono';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projects.controller.js'
import { authMiddleware } from '../middlewares/auth.js';

import { zValidator } from '@hono/zod-validator';
import { projectSchema } from '../schemas/projects.schema.js';

const projects = new Hono();

projects.get('/', getProjects);
projects.get('/:id', getProjectById);

projects.post('/', authMiddleware, zValidator('json', projectSchema), createProject);
projects.put('/:id', authMiddleware, zValidator('json', projectSchema), updateProject);
projects.delete('/:id', authMiddleware, deleteProject);

export default projects;