import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

import authRoutes from '../../routes/auth.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'
import { login, logout, me } from '../../controllers/auth.controller.js'

vi.mock('../../controllers/auth.controller.js', () => ({
  login: vi.fn((c) => c.json({ success: true, message: 'Logged in' })),
  logout: vi.fn((c) => c.json({ success: true, message: 'Logged out successfully' })),
  me: vi.fn((c) => c.json({ id: '123', email: 'test@example.com', name: 'Admin' }))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { id: '123', email: 'test@example.com' })
    await next()
  })
}))

describe('Auth Routes', () => {
  let app: Hono

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/auth', authRoutes)
  })

  describe('Public Routes', () => {
    it('should process login on POST /auth/login with valid payload', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'securePassword123' })
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true, message: 'Logged in' })
      expect(login).toHaveBeenCalled()
    })

    it('should return 400 on POST /auth/login with invalid payload due to schema validation', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email' })
      })

      expect(res.status).toBe(400)
      expect(login).not.toHaveBeenCalled()
    })

    it('should process logout on POST /auth/logout', async () => {
      const res = await app.request('/auth/logout', {
        method: 'POST'
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true, message: 'Logged out successfully' })
      expect(logout).toHaveBeenCalled()
    })
  })

  describe('Protected Routes', () => {
    it('should return user data on GET /auth/me when authenticated', async () => {
      const res = await app.request('/auth/me')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ id: '123', email: 'test@example.com', name: 'Admin' })
      expect(authMiddleware).toHaveBeenCalled()
      expect(me).toHaveBeenCalled()
    })

    it('should block GET /auth/me when not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/auth/me')

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
      expect(me).not.toHaveBeenCalled()
    })
  })
})
