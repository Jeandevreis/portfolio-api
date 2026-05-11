import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const findUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
};

export const updateLoginAttempts = async (userId: string, attempts: number, lockUntil: Date | null) => {
  await db.update(users)
    .set({ loginAttempts: attempts, lockUntil })
    .where(eq(users.id, userId));
};

export const resetLoginAttempts = async (userId: string) => {
  await db.update(users)
    .set({ loginAttempts: 0, lockUntil: null })
    .where(eq(users.id, userId));
};
