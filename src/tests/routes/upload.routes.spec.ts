import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

import uploadRoutes from '../../routes/upload.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'
import { getCloudinarySignature } from '../../controllers/upload.controller.js'

vi.mock('../../controllers/upload.controller.js', () => ({
  getCloudinarySignature: vi.fn((c) => c.json({
    timestamp: 1715000000,
    signature: 'mocked-signature-string'
  }, 200))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { id: 'user-123' })
    await next()
  })
}))

describe('Upload Routes', () => {
  let app: Hono

  const validPayload = {
    folder: 'projects',
    identifier: 'proj-123'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/uploads', uploadRoutes)
  })

  describe('Protected Routes', () => {
    it('should return signature data on POST /api/uploads/cloudinary-signature when authenticated and payload is valid', async () => {
      const res = await app.request('/api/uploads/cloudinary-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({
        timestamp: 1715000000,
        signature: 'mocked-signature-string'
      })
      expect(getCloudinarySignature).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should return 400 on POST /api/uploads/cloudinary-signature if payload is invalid due to schema validation', async () => {
      const res = await app.request('/api/uploads/cloudinary-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'invalid-folder', identifier: '' })
      })

      expect(res.status).toBe(400)
      expect(getCloudinarySignature).not.toHaveBeenCalled()
    })

    it('should block POST /api/uploads/cloudinary-signature when not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/uploads/cloudinary-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
      expect(getCloudinarySignature).not.toHaveBeenCalled()
    })
  })
})
