import { Context } from 'hono';

export const getServices = async (c: Context) => {
  try {
    return c.json('Ok', 200);
  } catch (error: any) {
    return c.json('Erro ao buscar serviços', 500);
  }
};