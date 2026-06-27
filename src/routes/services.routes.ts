import { Hono } from 'hono';

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/services.controller.js';

import { authMiddleware } from '../middlewares/auth.js';

import { zValidator } from '@hono/zod-validator';
import { serviceSchema } from '../schemas/services.schema.js';

const service = new Hono();

service.get('/', getServices);
service.get('/:id', getServiceById);

service.post('/', authMiddleware, zValidator('json', serviceSchema), createService);
service.put('/:id', authMiddleware, zValidator('json', serviceSchema), updateService);

service.delete('/:id', authMiddleware, deleteService);

export default service;
