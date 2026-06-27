import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

import servicesRoutes from '../../routes/services.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../../controllers/services.controller.js'

vi.mock('../../controllers/services.controller.js', () => ({
  getServices: vi.fn((c) => c.json([{ id: 1, title: 'Web Development' }])),
  getServiceById: vi.fn((c) => c.json({ id: c.req.param('id'), title: 'Web Development' })),
  createService: vi.fn((c) => c.json({ success: true }, 201)),
  updateService: vi.fn((c) => c.json({ success: true }, 200)),
  deleteService: vi.fn((c) => c.json({ message: 'Deleted' }, 200))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { id: 'user-123' })
    await next()
  })
}))

describe('Services Routes', () => {
  let app: Hono

  const validPayload = {
    link: 'https://site.com',
    imageUrl: 'https://site.com/image.png',
    translations: [
      {
        language: 'en',
        title: 'Valid Service Title',
        description: 'This is a description with enough characters'
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/services', servicesRoutes)
  })

  describe('Public Routes', () => {
    it('should return a list of services on GET /api/services', async () => {
      const res = await app.request('/api/services')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual([{ id: 1, title: 'Web Development' }])
      expect(getServices).toHaveBeenCalled()
    })

    it('should return a specific service on GET /api/services/:id', async () => {
      const res = await app.request('/api/services/42')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ id: '42', title: 'Web Development' })
      expect(getServiceById).toHaveBeenCalled()
    })
  })

  describe('Protected Routes', () => {
    it('should create a service if user is authenticated and payload is valid on POST /api/services', async () => {
      const res = await app.request('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data).toEqual({ success: true })
      expect(createService).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should return 400 on POST /api/services if payload is invalid due to schema validation', async () => {
      const res = await app.request('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalidField: true })
      })

      expect(res.status).toBe(400)
      expect(createService).not.toHaveBeenCalled()
    })

    it('should update a service if user is authenticated and payload is valid on PUT /api/services/:id', async () => {
      const res = await app.request('/api/services/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true })
      expect(updateService).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should return 400 on PUT /api/services/:id if payload is invalid due to schema validation', async () => {
      const res = await app.request('/api/services/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: 'not-a-url' })
      })

      expect(res.status).toBe(400)
      expect(updateService).not.toHaveBeenCalled()
    })

    it('should delete a service if user is authenticated on DELETE /api/services/:id', async () => {
      const res = await app.request('/api/services/1', {
        method: 'DELETE'
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ message: 'Deleted' })
      expect(deleteService).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should block POST /api/services if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
      expect(createService).not.toHaveBeenCalled()
    })

    it('should block PUT /api/services/:id if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/services/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(401)
      expect(updateService).not.toHaveBeenCalled()
    })

    it('should block DELETE /api/services/:id if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/services/1', {
        method: 'DELETE'
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
      expect(deleteService).not.toHaveBeenCalled()
    })
  })
})
