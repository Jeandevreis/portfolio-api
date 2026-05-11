import { Context } from 'hono';

import {
  findAllEducations,
  findEducationById,
  createEducationRecord,
  updateEducationRecord,
  deleteEducationRecord
} from '../repositories/educations.repository.js';

export const getEducations = async (c: Context) => {
  try {
    const result = await findAllEducations();
    return c.json(result);
  } catch (error: any) {
    return c.json({ message: 'Erro ao buscar educações', error: error.message }, 500);
  }
};

export const getEducationById = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const record = await findEducationById(id);

    if (!record) {
      return c.json({ message: 'Registro de educação não encontrado' }, 404);
    }

    return c.json(record);
  } catch (error: any) {
    return c.json({ message: 'Erro ao procurar educação', error: error.message }, 500);
  }
};

export const createEducation = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { translations, ...educationData } = body;

    const eduRecord = await createEducationRecord(educationData, translations);

    return c.json(eduRecord, 201);
  } catch (error: any) {
    console.error('ERRO AO CRIAR EDUCAÇÃO:', error);
    return c.json({
      message: 'Erro interno ao salvar educação',
      error: error.message
    }, 500);
  }
};

export const updateEducation = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const body = await c.req.json();
    const { translations, ...educationData } = body;

    await updateEducationRecord(id, educationData, translations);

    return c.json({ message: 'Educação atualizada com sucesso' });
  } catch (error: any) {
    console.error('ERRO AO ATUALIZAR EDUCAÇÃO:', error);
    return c.json({ message: 'Erro ao atualizar educação', error: error.message }, 500);
  }
};

export const deleteEducation = async (c: Context) => {
  const id = c.req.param('id');

  try {
    await deleteEducationRecord(id);
    return c.json({ message: 'Registro de educação removido com sucesso' });
  } catch (error: any) {
    return c.json({ message: 'Erro ao deletar educação', error: error.message }, 500);
  }
};
