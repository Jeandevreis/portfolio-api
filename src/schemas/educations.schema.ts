import { z } from 'zod';

const educationTranslationSchema = z.object({
  language: z.string().max(4).min(2, { error: 'education.error.language' }),
  name: z.string().min(3, { error: 'education.error.name' }),
  institution: z.string().min(2, { error: 'education.error.institution' }),
  description: z.string().min(10, { error: 'education.error.description' }),
}).strict();

export const educationSchema = z.object({
  startDate: z.string().min(10, { error: 'education.error.start_date' }),
  endDate: z.string().min(10, { error: 'education.error.end_date' }).optional().nullable().or(z.literal('')),

  type: z.enum(['college', 'course', 'certification'], {
    error: 'education.error.type',
  }),

  durationHours: z.number().int().positive({ error: 'education.error.duration_hours' }).optional().nullable(),
  imageUrl: z.url({ error: 'education.error.image_url' })
    .startsWith('http', { message: 'education.error.image_url' })
    .optional()
    .nullable()
    .or(z.literal('')),

  certificateUrl: z.url({ error: 'education.error.certificate_url' })
    .startsWith('http', { message: 'education.error.certificate_url' })
    .optional()
    .nullable()
    .or(z.literal('')),

  status: z.string().min(2, { error: 'education.error.status' }),
  translations: z.array(educationTranslationSchema).min(1, { error: 'education.error.translations_required' }),
}).strict();
