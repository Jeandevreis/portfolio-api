import type { Context } from 'hono';

import { fetchGithubProjectStats } from '../services/github.service.js';

import {
  getAllProjectsForSync,
  upsertProjectGithubStats
} from '../repositories/github.repository.js';

import { githubSchema } from '../schemas/github.schema.js';

export const syncGithubData = async (c: Context) => {
  try {
    const allProjects = await getAllProjectsForSync();

    let successCount = 0;
    let errorCount = 0;

    for (const project of allProjects) {
      if (!project.repoUrl) continue;

      const stats = await fetchGithubProjectStats(project.repoUrl);

      if (stats) {
        await upsertProjectGithubStats(project.id, stats);
        successCount++;
      } else {
        errorCount++;
      }
    }

    return c.json({
      message: 'Github data synced successfully',
      data: {
        updated: successCount,
        failed: errorCount,
      }
    }, 200);

  } catch (error: any) {
    return c.json({ error: 'github.error.sync', message: error.message }, 500);
  }
};

export const previewGithubData = async (c: Context) => {
  try {
    const { repoUrl } = githubSchema.parse(await c.req.json());

    const stats = await fetchGithubProjectStats(repoUrl);
    if (!stats) return c.json({
      error: 'github.error.not_found', message: 'Repository not found'
    }, 404);

    return c.json(stats, 200);

  } catch (error: any) {
    return c.json({ error: 'github.error.preview', message: error.message }, 500);
  }
};
