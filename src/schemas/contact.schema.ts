import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(3, { message: 'contact.error.name' }),
  company: z.string().min(3, { message: 'contact.error.company' }),
  email: z.email({ message: 'contact.error.email' }).optional().or(z.literal('')),
  whatsapp: z.string().min(10, { message: 'contact.error.whatsapp' }).optional().or(z.literal('')),
  message: z.string().min(10, { message: 'contact.error.message' }),

}).refine((data) => (data.email && data.email.trim() !== '') || (data.whatsapp && data.whatsapp.trim() !== ''), {
  message: 'contact.error.email_or_whatsapp',
  path: ['email'],
});
