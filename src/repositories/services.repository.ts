import { db } from '../db/index.js';
import { services, serviceTranslations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type Service = typeof services.$inferSelect;
type ServiceTranslation = typeof serviceTranslations.$inferSelect;

type NewService = typeof services.$inferInsert;
type NewServiceTranslation = typeof serviceTranslations.$inferInsert;

export const findAllServices = async (): Promise<Array<Service & { translations: ServiceTranslation[] }>> => {
  return await db.query.services.findMany({
    with: { translations: true }
  });
};

export const findServiceById = async (id: string): Promise<(Service & { translations: ServiceTranslation[] }) | undefined> => {
  return await db.query.services.findFirst({
    where: eq(services.id, id),
    with: { translations: true }
  });
};

export const createServiceRecord = async (
  serviceData: NewService,
  translations: Omit<NewServiceTranslation, 'serviceId'>[]
) => {
  return await db.transaction(async (tx) => {
    const [service] = await tx.insert(services).values(serviceData).returning();

    if (!service) return null;

    let insertedTranslations: ServiceTranslation[] = [];

    if (translations?.length) {
      insertedTranslations = await tx.insert(serviceTranslations).values(
        translations.map((t) => ({
          ...t,
          serviceId: service.id,
        }))
      ).returning();
    }

    return {
      ...service,
      translations: insertedTranslations
    };
  });
};

export const updateServiceRecord = async (
  id: string,
  serviceData: NewService,
  translations: Omit<NewServiceTranslation, 'serviceId'>[]
) => {
  return await db.transaction(async (tx) => {

    const [updatedService] = await tx.update(services)
      .set({ ...serviceData, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();

    if (!updatedService) return null;

    let updatedTranslations: ServiceTranslation[] = [];

    if (translations && Array.isArray(translations)) {
      await tx.delete(serviceTranslations).where(eq(serviceTranslations.serviceId, id));

      if (translations.length > 0) {
        updatedTranslations = await tx.insert(serviceTranslations).values(
          translations.map((t) => ({
            ...t,
            serviceId: id,
          }))
        ).returning();
      }
    }

    return {
      ...updatedService,
      translations: updatedTranslations,
    };
  });
};

export const deleteServiceRecord = async (id: string) => {

  const [deletedService] = await db.delete(services)
    .where(eq(services.id, id))
    .returning({ id: services.id });

  if (!deletedService) return null;

  return deletedService;
};
