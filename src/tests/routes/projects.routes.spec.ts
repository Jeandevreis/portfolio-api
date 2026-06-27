import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

import projectsRoutes from '../../routes/projects.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../../controllers/projects.controller.js'

vi.mock('../../controllers/projects.controller.js', () => ({
  getProjects: vi.fn((c) => c.json([{ id: 1, title: 'Portfolio Website' }])),
  getProjectById: vi.fn((c) => c.json({ id: c.req.param('id'), title: 'Portfolio Website' })),
  createProject: vi.fn((c) => c.json({ success: true }, 201)),
  updateProject: vi.fn((c) => c.json({ success: true }, 200)),
  deleteProject: vi.fn((c) => c.json({ message: 'Deleted' }, 200))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { id: 'user-123' })
    await next()
  })
}))

describe('Projects Routes', () => {
  let app: Hono

  const validPayload = {
    liveUrl: 'https://site.com',
    translations: [
      {
        language: 'en',
        title: 'Valid Project Title',
        description: 'This is a description with enough characters'
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/projects', projectsRoutes)
  })

  describe('Public Routes', () => {
    it('should return a list of projects on GET /api/projects', async () => {
      const res = await app.request('/api/projects')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual([{ id: 1, title: 'Portfolio Website' }])
      expect(getProjects).toHaveBeenCalled()
    })

    it('should return a specific project on GET /api/projects/:id', async () => {
      const res = await app.request('/api/projects/42')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ id: '42', title: 'Portfolio Website' })
      expect(getProjectById).toHaveBeenCalled()
    })
  })

  describe('Protected Routes', () => {
    it('should create a project if user is authenticated and payload is valid on POST /api/projects', async () => {
      const res = await app.request('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data).toEqual({ success: true })
      expect(createProject).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should return 400 on POST /api/projects if payload is invalid due to schema validation', async () => {
      const res = await app.request('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalidField: true })
      })

      expect(res.status).toBe(400)
      expect(createProject).not.toHaveBeenCalled()
    })

    it('should update a project if user is authenticated and payload is valid on PUT /api/projects/:id', async () => {
      const res = await app.request('/api/projects/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true })
      expect(updateProject).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should return 400 on PUT /api/projects/:id if payload is invalid due to schema validation', async () => {
      const res = await app.request('/api/projects/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liveUrl: 'not-a-url' })
      })

      expect(res.status).toBe(400)
      expect(updateProject).not.toHaveBeenCalled()
    })

    it('should delete a project if user is authenticated on DELETE /api/projects/:id', async () => {
      const res = await app.request('/api/projects/1', {
        method: 'DELETE'
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ message: 'Deleted' })
      expect(deleteProject).toHaveBeenCalled()
      expect(authMiddleware).toHaveBeenCalled()
    })

    it('should block POST /api/projects if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
      expect(createProject).not.toHaveBeenCalled()
    })

    it('should block PUT /api/projects/:id if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/projects/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(401)
      expect(updateProject).not.toHaveBeenCalled()
    })

    it('should block DELETE /api/projects/:id if user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/projects/1', {
        method: 'DELETE'
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
      expect(deleteProject).not.toHaveBeenCalled()
    })
  })
})
