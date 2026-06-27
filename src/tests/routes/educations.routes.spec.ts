import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

import educationsRoutes from '../../routes/educations.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'
import {
  getEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation
} from '../../controllers/educations.controller.js'

vi.mock('../../controllers/educations.controller.js', () => ({
  getEducations: vi.fn((c) => c.json([{ id: 1, title: 'Software Engineering' }])),
  getEducationById: vi.fn((c) => c.json({ id: c.req.param('id'), title: 'Software Engineering' })),
  createEducation: vi.fn((c) => c.json({ success: true }, 201)),
  updateEducation: vi.fn((c) => c.json({ success: true }, 200)),
  deleteEducation: vi.fn((c) => c.json({ message: 'Deleted' }, 200))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { id: 'user-123' })
    await next()
  })
}))

describe('Educations Routes', () => {
  let app: Hono

  const validPayload = {
    startDate: '2024-01-01',
    type: 'course',
    status: 'completed',
    translations: [
      {
        language: 'en',
        name: 'Web Development',
        institution: 'Tech Academy',
        description: 'A comprehensive course on web development'
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/educations', educationsRoutes)
  })

  describe('Public Routes', () => {
    it('should return a list of educations on GET /api/educations', async () => {
      const res = await app.request('/api/educations')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual([{ id: 1, title: 'Software Engineering' }])
      expect(getEducations).toHaveBeenCalled()
    })

    it('should return a specific education on GET /api/educations/:id', async () => {
      const res = await app.request('/api/educations/99')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ id: '99', title: 'Software Engineering' })
      expect(getEducationById).toHaveBeenCalled()
    })
  })

  describe('Protected Routes', () => {
    it('should create an education if user is authenticated and payload is valid on POST /api/educations', async () => {
      const res = await app.request('/api/educations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data).toEqual({ success: true })
      expect(createEducation).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should return 400 on POST /api/educations if payload is invalid due to schema validation', async () => {
      const res = await app.request('/api/educations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalidField: true })
      })

      expect(res.status).toBe(400)
      expect(createEducation).not.toHaveBeenCalled()
    })

    it('should update an education if user is authenticated and payload is valid on PUT /api/educations/:id', async () => {
      const res = await app.request('/api/educations/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true })
      expect(updateEducation).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should return 400 on PUT /api/educations/:id if payload is invalid due to schema validation', async () => {
      const res = await app.request('/api/educations/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: '2024' })
      })

      expect(res.status).toBe(400)
      expect(updateEducation).not.toHaveBeenCalled()
    })

    it('should delete an education if user is authenticated on DELETE /api/educations/:id', async () => {
      const res = await app.request('/api/educations/1', {
        method: 'DELETE'
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ message: 'Deleted' })
      expect(deleteEducation).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should block POST /api/educations if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/educations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
      expect(createEducation).not.toHaveBeenCalled()
    })

    it('should block PUT /api/educations/:id if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/educations/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(401)
      expect(updateEducation).not.toHaveBeenCalled()
    })

    it('should block DELETE /api/educations/:id if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/educations/1', {
        method: 'DELETE'
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
      expect(deleteEducation).not.toHaveBeenCalled()
    })
  })
})
