import { Context } from 'hono'

import {
  findAllServices,
  findServiceById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord
} from '../repositories/services.repository.js';

import { serviceSchema } from '../schemas/services.schema.js';

export const getServices = async (c: Context) => {
  try {
    const result = await findAllServices()
    return c.json(result, 200)

  } catch (error: any) {
    return c.json({ error: 'services.error.list', message: error.message }, 500)
  }
}

export const getServiceById = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const service = await findServiceById(id);

    if (!service) return c.json({
      error: 'services.error.not_found', message: 'Service not found'
    }, 404);

    return c.json(service, 200);

  } catch (error: any) {
    return c.json({ error: 'services.error.get_by_id', message: error.message }, 500);
  }
};

export const createService = async (c: Context) => {
  try {
    const { translations, ...service } = serviceSchema.parse(await c.req.json());

    const newService = await createServiceRecord(service, translations);

    if (!newService) return c.json({
      error: 'services.error.create', message: 'Service not created'
    }, 422);

    return c.json(newService, 201);

  } catch (error: any) {
    return c.json({ error: 'services.error.create', message: error.message }, 500);
  }
};

export const updateService = async (c: Context) => {
  const id = c.req.param('id')

  try {
    const { translations, ...service } = serviceSchema.parse(await c.req.json());

    console.log(service, translations);

    const updatedService = await updateServiceRecord(id, service, translations);

    if (!updatedService) return c.json({
      error: 'services.error.update', message: 'Service not updated'
    }, 422);

    return c.json(updatedService, 200);

  } catch (error: any) {
    return c.json({ error: 'services.error.update', message: error.message }, 500);
  }
}

export const deleteService = async (c: Context) => {
  const id = c.req.param('id')

  try {
    const deletedService = await deleteServiceRecord(id);

    if (!deletedService) return c.json({
      error: 'services.error.delete', message: 'Service not deleted'
    }, 422);

    return c.json(deletedService, 200);

  } catch (error: any) {
    return c.json({ error: 'services.error.delete', message: error.message }, 500);
  }
}
