import { db } from '../db/index.js';
import { projects, githubStats } from '../db/schema.js';

export const getAllProjectsForSync = async () => {
  return await db.select().from(projects);
};

export const upsertProjectGithubStats = async (projectId: string, stats: any) => {
  await db.insert(githubStats)
    .values({
      projectId,
      stars: stats.stars,
      languages: stats.languages,
      topics: stats.topics,
      syncedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: githubStats.projectId,
      set: {
        stars: stats.stars,
        languages: stats.languages,
        topics: stats.topics,
        syncedAt: new Date(),
      },
    });
};
