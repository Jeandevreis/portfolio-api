import { Context } from 'hono'
import { generateSignature } from '../services/cloudinary.service.js'

export const getCloudinarySignature = async (c: Context) => {
  const projectTitle = c.req.query('projectTitle')

  if (!projectTitle) {
    return c.json({ message: 'projectTitle is required' }, 400)
  }

  const signatureData = generateSignature(projectTitle)

  return c.json(signatureData)
}