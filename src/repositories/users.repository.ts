import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type User = typeof users.$inferSelect;

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const updateLoginAttempts = async (
  userId: string,
  attempts: number,
  lockUntil: Date | null
) => {
  const [updatedUser] = await db.update(users)
    .set({ loginAttempts: attempts, lockUntil })
    .where(eq(users.id, userId))
    .returning();

  if (!updatedUser) return null;

  return updatedUser;
};

export const resetLoginAttempts = async (userId: string) => {
  const [updatedUser] = await db.update(users)
    .set({ loginAttempts: 0, lockUntil: null })
    .where(eq(users.id, userId))
    .returning();

  if (!updatedUser) return null;

  return updatedUser;
};

export const updateUserProfile = async (
  id: string,
  data: { name?: string; email?: string; avatarUrl?: string | null }
) => {
  const [updatedUser] = await db.update(users)
    .set({
      name: data.name ?? undefined,
      email: data.email ?? undefined,
      avatarUrl: data.avatarUrl ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  if (!updatedUser) return null;

  return updatedUser;
};

export const updateUserPassword = async (
  id: string,
  passwordHash: string
) => {
  const [updatedUser] = await db.update(users)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  if (!updatedUser) return null;

  return updatedUser;
};
