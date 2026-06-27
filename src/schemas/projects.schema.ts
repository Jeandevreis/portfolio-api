import { z } from 'zod';

const projectTranslationSchema = z.object({
  language: z.string().min(2, { error: 'projects.error.language' }),
  title: z.string().min(3, { error: 'projects.error.title' }),
  description: z.string().min(10, { error: 'projects.error.description' }),
}).strict();

const githubStatsSchema = z.object({
  stars: z.number().int().nonnegative().optional(),
  languages: z.array(z.string()).optional(),
  topics: z.array(z.string()).optional(),
}).strict();

export const projectSchema = z.object({
  imageUrl: z.url({ error: 'projects.error.image_url' })
    .startsWith('http', { message: 'projects.error.image_url' })
    .optional()
    .nullable()
    .or(z.literal('')),

  liveUrl: z.url({ error: 'projects.error.live_url' })
    .startsWith('http', { message: 'projects.error.live_url' })
    .optional()
    .nullable()
    .or(z.literal('')),

  repoUrl: z.url({ error: 'projects.error.repo_url' })
    .startsWith('http', { message: 'projects.error.repo_url' })
    .optional()
    .nullable()
    .or(z.literal('')),

  translations: z.array(projectTranslationSchema).min(1, { error: 'projects.error.translations_required' }),

  githubStats: githubStatsSchema.optional().nullable(),
}).strict();
