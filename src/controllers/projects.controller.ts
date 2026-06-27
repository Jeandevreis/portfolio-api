import { Context } from 'hono';

import {
  findAllProjects,
  findProjectById,
  createProjectRecord,
  updateProjectRecord,
  deleteProjectRecord
} from '../repositories/projects.repository.js';

import { projectSchema } from '../schemas/projects.schema.js';

export const getProjects = async (c: Context) => {
  try {
    const result = await findAllProjects();
    return c.json(result, 200);

  } catch (error: any) {
    return c.json({ error: 'projects.error.list', message: error.message }, 500);
  }
};

export const getProjectById = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const project = await findProjectById(id);

    if (!project) return c.json({
      error: 'projects.error.not_found', message: 'Project not found'
    }, 404);

    return c.json(project, 200);

  } catch (error: any) {
    return c.json({ error: 'projects.error.get_by_id', message: error.message }, 500);
  }
};

export const createProject = async (c: Context) => {
  try {
    const { translations, ...projectData } = projectSchema.parse(await c.req.json());

    const newProject = await createProjectRecord(projectData, translations);

    if (!newProject) return c.json({
      error: 'projects.error.create', message: 'Project not created'
    }, 422);

    return c.json(newProject, 201);

  } catch (error: any) {
    return c.json({ error: 'projects.error.create', message: error.message }, 500);
  }
};

export const updateProject = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const { translations, ...projectData } = projectSchema.parse(await c.req.json());

    const updatedProject = await updateProjectRecord(id, projectData, translations);

    if (!updatedProject) return c.json({
      error: 'projects.error.update', message: 'Project not updated'
    }, 422);

    return c.json(updatedProject, 200);

  } catch (error: any) {
    return c.json({ error: 'projects.error.update', message: error.message }, 500);
  }
};

export const deleteProject = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const deletedProject = await deleteProjectRecord(id);

    if (!deletedProject) return c.json({
      error: 'projects.error.delete', message: 'Project not deleted'
    }, 422);

    return c.json(deletedProject, 200);

  } catch (error: any) {
    return c.json({ error: 'projects.error.delete', message: error.message }, 500);
  }
};
