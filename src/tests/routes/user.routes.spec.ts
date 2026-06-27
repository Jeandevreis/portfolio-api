import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

import userRoutes from '../../routes/user.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'
import {
  getProfile,
  updateProfile,
  changePassword
} from '../../controllers/user.controller.js'

vi.mock('../../controllers/user.controller.js', () => ({
  getProfile: vi.fn((c) => c.json({ id: '123', name: 'Test User' }, 200)),
  updateProfile: vi.fn((c) => c.json({ id: '123', name: 'Updated User' }, 200)),
  changePassword: vi.fn((c) => c.json({ message: 'Password updated successfully' }, 200))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { id: 'user-123' })
    await next()
  })
}))

describe('User Routes', () => {
  let app: Hono

  const validProfilePayload = {
    name: 'Updated User',
    email: 'updated@example.com'
  }

  const validPasswordPayload = {
    oldPassword: 'oldSecurePassword123',
    newPassword: 'newSecurePassword456'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/', userRoutes)
  })

  describe('Protected Routes', () => {
    describe('GET /profile', () => {
      it('should return profile data when authenticated', async () => {
        const res = await app.request('/profile')

        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data).toEqual({ id: '123', name: 'Test User' })
        expect(authMiddleware).toHaveBeenCalled()
        expect(getProfile).toHaveBeenCalled()
      })

      it('should block request when not authenticated', async () => {
        vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
          return c.json({ message: 'Unauthorized' }, 401)
        })

        const res = await app.request('/profile')

        expect(res.status).toBe(401)
        const data = await res.json()
        expect(data).toEqual({ message: 'Unauthorized' })
        expect(getProfile).not.toHaveBeenCalled()
      })
    })

    describe('PUT /profile', () => {
      it('should process profile update when authenticated and payload is valid', async () => {
        const res = await app.request('/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validProfilePayload)
        })

        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data).toEqual({ id: '123', name: 'Updated User' })
        expect(authMiddleware).toHaveBeenCalled()
        expect(updateProfile).toHaveBeenCalled()
      })

      it('should return 400 if payload is invalid due to schema validation', async () => {
        const res = await app.request('/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })

        expect(res.status).toBe(400)
        expect(updateProfile).not.toHaveBeenCalled()
      })

      it('should block request when not authenticated', async () => {
        vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
          return c.json({ message: 'Unauthorized' }, 401)
        })

        const res = await app.request('/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validProfilePayload)
        })

        expect(res.status).toBe(401)
        const data = await res.json()
        expect(data).toEqual({ message: 'Unauthorized' })
        expect(updateProfile).not.toHaveBeenCalled()
      })
    })

    describe('PUT /password', () => {
      it('should process password change when authenticated and payload is valid', async () => {
        const res = await app.request('/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validPasswordPayload)
        })

        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data).toEqual({ message: 'Password updated successfully' })
        expect(authMiddleware).toHaveBeenCalled()
        expect(changePassword).toHaveBeenCalled()
      })

      it('should return 400 if payload is invalid due to schema validation', async () => {
        const res = await app.request('/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldPassword: 'short' })
        })

        expect(res.status).toBe(400)
        expect(changePassword).not.toHaveBeenCalled()
      })

      it('should block request when not authenticated', async () => {
        vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
          return c.json({ message: 'Unauthorized' }, 401)
        })

        const res = await app.request('/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validPasswordPayload)
        })

        expect(res.status).toBe(401)
        const data = await res.json()
        expect(data).toEqual({ message: 'Unauthorized' })
        expect(changePassword).not.toHaveBeenCalled()
      })
    })
  })
})
