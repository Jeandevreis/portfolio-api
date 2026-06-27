import { Hono } from 'hono';
import { sendContactEmail } from '../controllers/contact.controller.js';

import { zValidator } from '@hono/zod-validator';
import { contactSchema } from '../schemas/contact.schema.js';

const contact = new Hono();

contact.post('/', zValidator('json', contactSchema), sendContactEmail);

export default contact;
