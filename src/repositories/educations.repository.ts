import { db } from '../db/index.js';
import { education, educationTranslations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type Education = typeof education.$inferSelect;
type EducationTranslation = typeof educationTranslations.$inferSelect;

type NewEducation = typeof education.$inferInsert;
type NewEducationTranslation = typeof educationTranslations.$inferInsert;

export const findAllEducations = async (): Promise<Array<Education & { translations: EducationTranslation[] }>> => {
  return await db.query.education.findMany({
    with: { translations: true }
  });
};

export const findEducationById = async (id: string): Promise<(Education & { translations: EducationTranslation[] }) | undefined> => {
  return await db.query.education.findFirst({
    where: eq(education.id, id),
    with: { translations: true }
  });
};

export const createEducationRecord = async (
  educationData: NewEducation,
  translationsData: Omit<NewEducationTranslation, 'educationId'>[]
) => {
  return await db.transaction(async (tx) => {
    const [eduRecord] = await tx.insert(education).values(educationData).returning();

    if (!eduRecord) return null;

    let insertedTranslations: EducationTranslation[] = [];

    if (translationsData?.length) {
      insertedTranslations = await tx.insert(educationTranslations).values(
        translationsData.map((t) => ({
          ...t,
          educationId: eduRecord.id,
        }))
      ).returning();
    }

    return {
      ...eduRecord,
      translations: insertedTranslations,
    };
  });
};

export const updateEducationRecord = async (
  id: string,
  educationData: NewEducation,
  translationsData: Omit<NewEducationTranslation, 'educationId'>[]
) => {
  return await db.transaction(async (tx) => {
    const [updatedEducation] = await tx.update(education)
      .set({
        ...educationData,
        updatedAt: new Date()
      })
      .where(eq(education.id, id))
      .returning();

    if (!updatedEducation) return null;

    let updatedTranslations: EducationTranslation[] = [];

    if (translationsData && Array.isArray(translationsData)) {
      await tx.delete(educationTranslations).where(eq(educationTranslations.educationId, id));

      if (translationsData.length > 0) {
        updatedTranslations = await tx.insert(educationTranslations).values(
          translationsData.map((t) => ({
            ...t,
            educationId: id,
          }))
        ).returning();
      }
    }

    return {
      ...updatedEducation,
      translations: updatedTranslations,
    };
  });
};

export const deleteEducationRecord = async (id: string) => {
  const [deletedEducation] = await db.delete(education)
    .where(eq(education.id, id))
    .returning({ id: education.id });

  if (!deletedEducation) return null;

  return deletedEducation;
};
