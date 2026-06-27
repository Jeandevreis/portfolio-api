import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import githubRoutes from '../../routes/github.routes.js'
import { authMiddleware } from '../../middlewares/auth.js'
import { cronMiddleware } from '../../middlewares/cron.js'
import { syncGithubData, previewGithubData } from '../../controllers/github.controller.js'

vi.mock('../../controllers/github.controller.js', () => ({
  syncGithubData: vi.fn((c) => c.json({ success: true, message: 'Synced successfully' }, 200)),
  previewGithubData: vi.fn((c) => c.json({ repos: ['repo-1', 'repo-2'] }, 200))
}))

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { id: 'user-123' })
    await next()
  })
}))

vi.mock('../../middlewares/cron.js', () => ({
  cronMiddleware: vi.fn(async (c, next) => await next())
}))

describe('GitHub Routes', () => {
  let app: Hono

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/github', githubRoutes)
  })

  describe('Cron & Sync Routes', () => {
    it('should process GET /api/github/cron/sync when cron validation passes', async () => {
      const res = await app.request('/api/github/cron/sync')

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true, message: 'Synced successfully' })
      expect(cronMiddleware).toHaveBeenCalled()
      expect(syncGithubData).toHaveBeenCalled()
    })

    it('should process POST /api/github/sync when cron validation passes', async () => {
      const res = await app.request('/api/github/sync', {
        method: 'POST'
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true, message: 'Synced successfully' })
      expect(cronMiddleware).toHaveBeenCalled()
      expect(syncGithubData).toHaveBeenCalled()
    })

    it('should block GET /api/github/cron/sync if cron validation fails', async () => {
      vi.mocked(cronMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Forbidden' }, 403)
      })

      const res = await app.request('/api/github/cron/sync')

      expect(res.status).toBe(403)
      const data = await res.json()
      expect(data).toEqual({ message: 'Forbidden' })
      expect(syncGithubData).not.toHaveBeenCalled()
    })
  })

  describe('Preview Routes', () => {
    const validPayload = { repoUrl: 'https://github.com/user/repo' }

    it('should process POST /api/github/preview with valid payload when authenticated', async () => {
      const res = await app.request('/api/github/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ repos: ['repo-1', 'repo-2'] })
      expect(authMiddleware).toHaveBeenCalled()
      expect(previewGithubData).toHaveBeenCalled()
    })

    it('should return 400 on POST /api/github/preview with invalid payload due to schema validation', async () => {
      const res = await app.request('/api/github/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: 'not-a-url' })
      })

      expect(res.status).toBe(400)
      expect(previewGithubData).not.toHaveBeenCalled()
    })

    it('should block POST /api/github/preview when user is not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401)
      })

      const res = await app.request('/api/github/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data).toEqual({ message: 'Unauthorized' })
      expect(previewGithubData).not.toHaveBeenCalled()
    })
  })
})
