import { db } from '../db/index.js';
import { education, educationTranslations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const findAllEducations = async () => {
  return await db.query.education.findMany({
    with: {
      translations: true,
    },
  });
};

export const findEducationById = async (id: string) => {
  return await db.query.education.findFirst({
    where: eq(education.id, id),
    with: {
      translations: true,
    },
  });
};

export const createEducationRecord = async (educationData: any, translationsData: any[]) => {
  const insertedEducation = await db.insert(education).values(educationData).returning();
  const eduRecord = insertedEducation[0];

  if (!eduRecord) {
    throw new Error('Falha ao inserir registro de educação no banco de dados.');
  }

  if (translationsData && Array.isArray(translationsData) && translationsData.length > 0) {
    const translationsWithId = translationsData.map((t: any) => ({
      educationId: eduRecord.id,
      language: t.language,
      institution: t.institution,
      name: t.name,
      description: t.description,
    }));

    await db.insert(educationTranslations).values(translationsWithId);
  }

  return eduRecord;
};

export const updateEducationRecord = async (id: string, educationData: any, translationsData: any[]) => {
  await db.update(education)
    .set({
      ...educationData,
      updatedAt: new Date()
    })
    .where(eq(education.id, id));

  if (translationsData && Array.isArray(translationsData)) {
    await db.delete(educationTranslations).where(eq(educationTranslations.educationId, id));

    if (translationsData.length > 0) {
      const translationsWithId = translationsData.map((t: any) => ({
        educationId: id,
        language: t.language,
        institution: t.institution,
        name: t.name,
        description: t.description,
      }));
      await db.insert(educationTranslations).values(translationsWithId);
    }
  }
};

export const deleteEducationRecord = async (id: string) => {
  await db.delete(education).where(eq(education.id, id));
};
