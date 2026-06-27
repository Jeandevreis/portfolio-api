import { db } from '../db/index.js';
import { projects, githubStats } from '../db/schema.js';

type Project = typeof projects.$inferSelect;

type NewGithubStat = typeof githubStats.$inferInsert;

export const getAllProjectsForSync = async (): Promise<Project[]> => {
  return await db.query.projects.findMany();
};

export const upsertProjectGithubStats = async (
  projectId: string,
  stats: Omit<NewGithubStat, 'projectId' | 'syncedAt'>
) => {
  const [upsertedStats] = await db.insert(githubStats)
    .values({
      ...stats,
      projectId,
      syncedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: githubStats.projectId,
      set: {
        ...stats,
        syncedAt: new Date(),
      },
    })
    .returning();

  if (!upsertedStats) return null;

  return upsertedStats;
};
