import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, { error: 'users.error.name' }).optional(),
  email: z.email({ error: 'users.error.email' }).optional(),
  avatarUrl: z.url({ error: 'users.error.avatar_url' }).optional().nullable().or(z.literal('')),
}).strict().refine((data) => Object.keys(data).length > 0, {
  error: 'users.error.empty_payload',
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, { error: 'users.error.old_password' }),
  newPassword: z.string().min(6, { error: 'users.error.new_password' }),
}).strict();
