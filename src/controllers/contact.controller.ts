import { Context } from 'hono';

import { sendContactFormEmail } from '../services/resend.service.js';

import { contactSchema } from '../schemas/contact.schema.js';

export const sendContactEmail = async (c: Context) => {
  try {
    const contactData = contactSchema.parse(await c.req.json());

    const result = await sendContactFormEmail(contactData);

    if (!result.success) return c.json({
      error: 'contact.error.send', message: result.error
    }, 422);

    return c.json(result.data, 200);

  } catch (error: any) {
    return c.json({ error: 'contact.error.send', message: error.message }, 500);
  }
};
