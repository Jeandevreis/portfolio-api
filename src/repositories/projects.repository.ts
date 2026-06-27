import { db } from '../db/index.js';
import { projects, projectTranslations, githubStats } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type Project = typeof projects.$inferSelect;
type ProjectTranslation = typeof projectTranslations.$inferSelect;
type GithubStat = typeof githubStats.$inferSelect;

type NewProject = typeof projects.$inferInsert;
type NewProjectTranslation = typeof projectTranslations.$inferInsert;
type NewGithubStat = typeof githubStats.$inferInsert;

export const findAllProjects = async (): Promise<Array<Project & { translations: ProjectTranslation[]; githubStats: GithubStat | null }>> => {
  return await db.query.projects.findMany({
    with: {
      translations: true,
      githubStats: true,
    },
  });
};

export const findProjectById = async (id: string): Promise<(Project & { translations: ProjectTranslation[]; githubStats: GithubStat | null }) | undefined> => {
  return await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      translations: true,
      githubStats: true,
    },
  });
};

export const createProjectRecord = async (
  projectData: NewProject,
  translations: Omit<NewProjectTranslation, 'projectId'>[],
  incomingGithubStats?: Omit<NewGithubStat, 'projectId'>
) => {
  return await db.transaction(async (tx) => {
    const [project] = await tx.insert(projects).values(projectData).returning();

    if (!project) return null;

    let insertedTranslations: ProjectTranslation[] = [];

    if (translations?.length) {
      insertedTranslations = await tx.insert(projectTranslations).values(
        translations.map((t) => ({
          ...t,
          projectId: project.id,
        }))
      ).returning();
    }

    let insertedGithubStats: GithubStat | null = null;

    if (incomingGithubStats) {
      const [stats] = await tx.insert(githubStats).values({
        ...incomingGithubStats,
        projectId: project.id,
      }).returning();

      insertedGithubStats = stats;
    }

    return {
      ...project,
      translations: insertedTranslations,
      githubStats: insertedGithubStats,
    };
  });
};

export const updateProjectRecord = async (
  id: string,
  projectData: NewProject,
  translations: Omit<NewProjectTranslation, 'projectId'>[],
  incomingGithubStats?: Omit<NewGithubStat, 'projectId'>
) => {
  return await db.transaction(async (tx) => {
    const [updatedProject] = await tx.update(projects)
      .set({ ...projectData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    if (!updatedProject) return null;

    let updatedTranslations: ProjectTranslation[] = [];

    if (translations && Array.isArray(translations)) {
      await tx.delete(projectTranslations).where(eq(projectTranslations.projectId, id));

      if (translations.length > 0) {
        updatedTranslations = await tx.insert(projectTranslations).values(
          translations.map((t) => ({
            ...t,
            projectId: id,
          }))
        ).returning();
      }
    }

    let updatedGithubStats: GithubStat | null = null;

    if (incomingGithubStats) {
      const [stats] = await tx.insert(githubStats)
        .values({
          ...incomingGithubStats,
          projectId: id,
          syncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: githubStats.projectId,
          set: {
            ...incomingGithubStats,
            syncedAt: new Date(),
          },
        })
        .returning();

      updatedGithubStats = stats;
    }

    return {
      ...updatedProject,
      translations: updatedTranslations,
      githubStats: updatedGithubStats,
    };
  });
};

export const deleteProjectRecord = async (id: string) => {
  const [deletedProject] = await db.delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });

  if (!deletedProject) return null;

  return deletedProject;
};
