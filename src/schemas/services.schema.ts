import { z } from 'zod'

export const serviceSchema = z.object({
  link: z.url({ message: 'services.error.link' })
    .startsWith('http', { message: 'services.error.link' })
    .optional()
    .or(z.literal('')),

  imageUrl: z.url({ message: 'services.error.image_url' })
    .startsWith('http', { message: 'services.error.image_url' })
    .optional()
    .or(z.literal('')),

  translations: z.array(z.object({
    language: z.string().min(2, { message: 'services.error.language' }),
    title: z.string().min(3, { message: 'services.error.title' }),
    description: z.string().min(10, { message: 'services.error.description' }),
  }).strict()).min(1, { message: 'services.error.translations_required' }),
}).strict()
