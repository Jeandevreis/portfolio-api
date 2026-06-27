import { Hono } from 'hono';
import { getCloudinarySignature } from '../controllers/upload.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

import { zValidator } from '@hono/zod-validator';
import { cloudinarySignatureSchema } from '../schemas/cloudinary.schema.js';

const upload = new Hono();

upload.post(
  '/cloudinary-signature',
  authMiddleware,
  zValidator('json', cloudinarySignatureSchema),
  getCloudinarySignature
);

export default upload;
