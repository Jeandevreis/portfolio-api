import { Context } from 'hono';

import {
  findAllEducations,
  findEducationById,
  createEducationRecord,
  updateEducationRecord,
  deleteEducationRecord
} from '../repositories/educations.repository.js';

import { educationSchema } from '../schemas/educations.schema.js';

export const getEducations = async (c: Context) => {
  try {
    const result = await findAllEducations();
    return c.json(result, 200);

  } catch (error: any) {
    return c.json({ error: 'educations.error.list', message: error.message }, 500);
  }
};

export const getEducationById = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const record = await findEducationById(id);

    if (!record) return c.json({
      error: 'educations.error.not_found', message: 'Education record not found'
    }, 404);

    return c.json(record, 200);

  } catch (error: any) {
    return c.json({ error: 'educations.error.get_by_id', message: error.message }, 500);
  }
};

export const createEducation = async (c: Context) => {
  try {
    const { translations, ...educationData } = educationSchema.parse(await c.req.json());

    const eduRecord = await createEducationRecord(educationData, translations);

    if (!eduRecord) return c.json({
      error: 'educations.error.create', message: 'Education not created'
    }, 422);

    return c.json(eduRecord, 201);

  } catch (error: any) {
    return c.json({ error: 'educations.error.create', message: error.message }, 500);
  }
};

export const updateEducation = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const { translations, ...educationData } = educationSchema.parse(await c.req.json());

    const updatedEducation = await updateEducationRecord(id, educationData, translations);

    if (!updatedEducation) return c.json({
      error: 'educations.error.update', message: 'Education not updated'
    }, 422);

    return c.json(updatedEducation, 200);

  } catch (error: any) {
    return c.json({ error: 'educations.error.update', message: error.message }, 500);
  }
};

export const deleteEducation = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const deletedEducation = await deleteEducationRecord(id);

    if (!deletedEducation) return c.json({
      error: 'educations.error.delete', message: 'Education not deleted'
    }, 422);

    return c.json(deletedEducation, 200);

  } catch (error: any) {
    return c.json({ error: 'educations.error.delete', message: error.message }, 500);
  }
};
