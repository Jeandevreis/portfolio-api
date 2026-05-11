import { db } from '../db/index.js'
import { projects, projectTranslations, githubStats } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export const findAllProjects = async () => {
  return await db.query.projects.findMany({
    with: {
      translations: true,
      githubStats: true,
    },
  })
}

export const findProjectById = async (id: string) => {
  return await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      translations: true,
      githubStats: true,
    },
  })
}

export const createProjectRecord = async (projectData: any, translations: any[], incomingGithubStats: any) => {
  const insertedProjects = await db.insert(projects).values(projectData).returning()
  const project = insertedProjects[0]

  if (!project) {
    throw new Error('Falha ao inserir o projecto principal no banco de dados.')
  }

  if (translations && Array.isArray(translations) && translations.length > 0) {
    const translationsWithId = translations.map((t: any) => ({
      projectId: project.id,
      language: t.language,
      title: t.title,
      description: t.description,
    }))

    await db.insert(projectTranslations).values(translationsWithId)
  }

  if (incomingGithubStats) {
    await db.insert(githubStats).values({
      projectId: project.id,
      stars: incomingGithubStats.stars || 0,
      languages: incomingGithubStats.languages || [],
      topics: incomingGithubStats.topics || [],
    })
  }

  return project
}

export const updateProjectRecord = async (id: string, projectData: any, translations: any[], incomingGithubStats: any) => {
  await db.update(projects)
    .set({
      ...projectData,
      updatedAt: new Date()
    })
    .where(eq(projects.id, id))

  if (translations && Array.isArray(translations)) {
    await db.delete(projectTranslations).where(eq(projectTranslations.projectId, id))

    if (translations.length > 0) {
      const translationsWithId = translations.map((t: any) => ({
        projectId: id,
        language: t.language,
        title: t.title,
        description: t.description,
      }))
      await db.insert(projectTranslations).values(translationsWithId)
    }
  }

  if (incomingGithubStats) {
    await db.insert(githubStats)
      .values({
        projectId: id,
        stars: incomingGithubStats.stars || 0,
        languages: incomingGithubStats.languages || [],
        topics: incomingGithubStats.topics || [],
        syncedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: githubStats.projectId,
        set: {
          stars: incomingGithubStats.stars || 0,
          languages: incomingGithubStats.languages || [],
          topics: incomingGithubStats.topics || [],
          syncedAt: new Date(),
        },
      })
  }
}

export const deleteProjectRecord = async (id: string) => {
  await db.delete(projects).where(eq(projects.id, id))
}
