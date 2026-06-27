import { z } from 'zod';

export const cloudinarySignatureSchema = z.object({
  folder: z.enum(['projects', 'services', 'educations', 'users', 'settings'], {
    error: 'cloudinary.error.invalid_folder',
  }),

  identifier: z.string().min(1, { error: 'cloudinary.error.invalid_identifier' }),
}).strict();
