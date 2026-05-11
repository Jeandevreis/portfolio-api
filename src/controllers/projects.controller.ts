import { Context } from 'hono'

import {
  findAllProjects,
  findProjectById,
  createProjectRecord,
  updateProjectRecord,
  deleteProjectRecord
} from '../repositories/projects.repository.js'

export const getProjects = async (c: Context) => {
  try {
    const result = await findAllProjects()
    return c.json(result)
  } catch (error: any) {
    return c.json({ message: 'Erro ao buscar projetos', error: error.message }, 500)
  }
}

export const getProjectById = async (c: Context) => {
  const id = c.req.param('id')

  try {
    const project = await findProjectById(id)

    if (!project) {
      return c.json({ message: 'Projeto não encontrado' }, 404)
    }

    return c.json(project)
  } catch (error: any) {
    return c.json({ message: 'Erro ao procurar projeto', error: error.message }, 500)
  }
}

export const createProject = async (c: Context) => {
  try {
    const body = await c.req.json()
    const { translations, githubStats, ...projectData } = body

    const project = await createProjectRecord(projectData, translations, githubStats)

    return c.json(project, 201)
  } catch (error: any) {
    console.error('ERRO AO CRIAR PROJECTO:', error)
    return c.json({
      message: 'Erro interno ao salvar projecto',
      error: error.message
    }, 500)
  }
}

export const updateProject = async (c: Context) => {
  const id = c.req.param('id')

  try {
    const body = await c.req.json()
    const { translations, githubStats, ...projectData } = body

    await updateProjectRecord(id, projectData, translations, githubStats)

    return c.json({ message: 'Projeto atualizado com sucesso' })
  } catch (error: any) {
    console.error('ERRO AO ATUALIZAR PROJETO:', error)
    return c.json({ message: 'Erro ao atualizar projeto', error: error.message }, 500)
  }
}

export const deleteProject = async (c: Context) => {
  const id = c.req.param('id')

  try {
    await deleteProjectRecord(id)
    return c.json({ message: 'Projeto removido com sucesso' })
  } catch (error: any) {
    return c.json({ message: 'Erro ao remover projeto', error: error.message }, 500)
  }
}
