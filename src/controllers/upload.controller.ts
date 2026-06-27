import { Context } from 'hono';

import { generateSignature } from '../services/cloudinary.service.js';
import { cloudinarySignatureSchema } from '../schemas/cloudinary.schema.js';

export const getCloudinarySignature = async (c: Context) => {
  try {
    const { folder, identifier } = cloudinarySignatureSchema.parse(await c.req.json());
    const signatureData = generateSignature(folder, identifier);

    if (!signatureData) return c.json({
      error: 'cloudinary.error.generate', message: 'Signature generation failed'
    }, 422);

    return c.json(signatureData, 200);

  } catch (error: any) {
    return c.json({ error: 'cloudinary.error.signature', message: error.message }, 500);
  }
};
