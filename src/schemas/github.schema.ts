import { z } from 'zod';

export const githubSchema = z.object({
  repoUrl: z.url({ error: 'github.error.repo_url' })
    .startsWith('http', { error: 'github.error.repo_url' })
}).strict();
