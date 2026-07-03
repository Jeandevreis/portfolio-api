import { z } from 'zod';

const educationTranslationSchema = z.object({
  language: z.string().max(4).min(2, { error: 'educations.error.language' }),
  name: z.string().min(3, { error: 'educations.error.name' }),
  institution: z.string().min(2, { error: 'educations.error.institution' }),
  description: z.string().min(10, { error: 'educations.error.description' }),
}).strict();

export const educationSchema = z.object({
  startDate: z.string().min(10, { error: 'educations.error.start_date' }),
  endDate: z.string().min(10, { error: 'educations.error.end_date' }).optional().nullable().or(z.literal('')),

  type: z.enum(['college', 'course', 'certification', 'bootcamp'], {
    error: 'educations.error.type',
  }),

  durationHours: z.literal('')
    .transform(() => undefined)
    .or(
      z.coerce.number().int().positive({ message: 'educations.error.duration_hours' })
    )
    .optional()
    .nullable(),


  imageUrl: z.url({ error: 'educations.error.image_url' })
    .startsWith('http', { message: 'educations.error.image_url' })
    .optional()
    .nullable()
    .or(z.literal('')),

  certificateUrl: z.url({ error: 'educations.error.certificate_url' })
    .startsWith('http', { message: 'educations.error.certificate_url' })
    .optional()
    .nullable()
    .or(z.literal('')),

  status: z.string().min(2, { error: 'educations.error.status' }),
  translations: z.array(educationTranslationSchema).min(1, { error: 'educations.error.translations_required' }),
}).strict();
