import { Hono } from 'hono';
import {
  getEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation
} from '../controllers/educations.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

import { zValidator } from '@hono/zod-validator';
import { educationSchema } from '../schemas/educations.schema.js';

const educations = new Hono();

educations.get('/', getEducations);
educations.get('/:id', getEducationById);

educations.post('/', authMiddleware, zValidator('json', educationSchema), createEducation);
educations.put('/:id', authMiddleware, zValidator('json', educationSchema), updateEducation);
educations.delete('/:id', authMiddleware, deleteEducation);

export default educations;