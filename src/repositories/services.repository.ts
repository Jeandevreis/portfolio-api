import { db } from '../db/index.js';
import { services, serviceTranslations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const findAllServices = async () => {
  return await db.query.services.findMany({
    with: {
      translations: true,
    },
  });
};

export const findServiceById = async (id: string) => {
  return await db.query.services.findFirst({
    where: eq(services.id, id),
    with: {
      translations: true,
    },
  });
};

export const createServiceRecord = async (serviceData: any, translations: any[]) => {
  const insertedServices = await db.insert(services).values(serviceData).returning()
  const service = insertedServices[0]

  if (!service) {
    throw new Error('Falha ao inserir o projecto principal no banco de dados.')
  }

  if (translations && Array.isArray(translations) && translations.length > 0) {
    const translationsWithId = translations.map((t: any) => ({
      serviceId: service.id,
      language: t.language,
      title: t.title,
      description: t.description,
    }))

    await db.insert(serviceTranslations).values(translationsWithId)
  }

  return service
}

export const updateServiceRecord = async (id: string, serviceData: any, translations: any[]) => {
  await db.update(services)
    .set({
      ...serviceData,
      updatedAt: new Date()
    })
    .where(eq(services.id, id))

  if (translations && Array.isArray(translations)) {
    await db.delete(serviceTranslations).where(eq(serviceTranslations.serviceId, id))

    if (translations.length > 0) {
      const translationsWithId = translations.map((t: any) => ({
        serviceId: id,
        language: t.language,
        title: t.title,
        description: t.description,
      }))
      await db.insert(serviceTranslations).values(translationsWithId)
    }
  }
}

export const deleteServiceRecord = async (id: string) => {
  await db.delete(services).where(eq(services.id, id));
};