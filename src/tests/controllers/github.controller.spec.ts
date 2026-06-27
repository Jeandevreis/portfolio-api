import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncGithubData, previewGithubData } from '../../controllers/github.controller.js'
import { fetchGithubProjectStats } from '../../services/github.service.js'
import {
  getAllProjectsForSync,
  upsertProjectGithubStats
} from '../../repositories/github.repository.js'

vi.mock('../../services/github.service.js', () => ({
  fetchGithubProjectStats: vi.fn()
}))

vi.mock('../../repositories/github.repository.js', () => ({
  getAllProjectsForSync: vi.fn(),
  upsertProjectGithubStats: vi.fn()
}))

describe('GitHub Controller', () => {
  let mockContext: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockContext = {
      req: {
        json: vi.fn()
      },
      json: vi.fn((data, status = 200) => ({ data, status }))
    }
  })

  describe('syncGithubData', () => {
    it('should iterate over projects, sync valid ones, and return stats with status 200', async () => {
      const mockProjects = [
        { id: '1', repoUrl: 'https://github.com/user/repo1' },
        { id: '2', repoUrl: null },
        { id: '3', repoUrl: 'https://github.com/user/repo3' }
      ]

      vi.mocked(getAllProjectsForSync).mockResolvedValue(mockProjects as any)

      vi.mocked(fetchGithubProjectStats).mockImplementation(async (url) => {
        if (url === 'https://github.com/user/repo1') return { stars: 10, languages: {}, topics: [] } as any
        return null
      })

      const result = await syncGithubData(mockContext)

      expect(fetchGithubProjectStats).toHaveBeenCalledTimes(2)
      expect(upsertProjectGithubStats).toHaveBeenCalledTimes(1)
      expect(upsertProjectGithubStats).toHaveBeenCalledWith('1', { stars: 10, languages: {}, topics: [] })

      expect(mockContext.json).toHaveBeenCalledWith({
        message: 'Github data synced successfully',
        data: {
          updated: 1,
          failed: 1
        }
      }, 200)
      expect(result.status).toBe(200)
    })

    it('should return 500 if an error occurs during sync', async () => {
      vi.mocked(getAllProjectsForSync).mockRejectedValue(new Error('Database error'))

      const result = await syncGithubData(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'github.error.sync', message: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('previewGithubData', () => {
    it('should return 500 if repoUrl validation fails', async () => {
      mockContext.req.json.mockResolvedValue({ repoUrl: 'not-a-valid-url' })

      const result = await previewGithubData(mockContext)

      expect(result.status).toBe(500)
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'github.error.preview' }),
        500
      )
    })

    it('should return 404 if fetchGithubProjectStats returns null', async () => {
      mockContext.req.json.mockResolvedValue({ repoUrl: 'https://github.com/user/invalid' })
      vi.mocked(fetchGithubProjectStats).mockResolvedValue(null)

      const result = await previewGithubData(mockContext)

      expect(result.status).toBe(404)
      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'github.error.not_found', message: 'Repository not found' },
        404
      )
    })

    it('should return 200 and stats if repository is found', async () => {
      const mockStats = { stars: 5, languages: { TS: 100 }, topics: ['react'] }
      mockContext.req.json.mockResolvedValue({ repoUrl: 'https://github.com/user/valid' })
      vi.mocked(fetchGithubProjectStats).mockResolvedValue(mockStats as any)

      const result = await previewGithubData(mockContext)

      expect(result.status).toBe(200)
      expect(mockContext.json).toHaveBeenCalledWith(mockStats, 200)
    })

    it('should return 500 if an unexpected error occurs', async () => {
      mockContext.req.json.mockResolvedValue({ repoUrl: 'https://github.com/user/valid' })
      vi.mocked(fetchGithubProjectStats).mockRejectedValue(new Error('Network error'))

      const result = await previewGithubData(mockContext)

      expect(result.status).toBe(500)
      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'github.error.preview', message: 'Network error' },
        500
      )
    })
  })
})
