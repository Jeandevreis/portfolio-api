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
        query: vi.fn()
      },
      json: vi.fn((data, status = 200) => ({ data, status }))
    }
  })

  describe('syncGithubData', () => {
    it('should iterate over projects, sync valid ones, and return stats', async () => {
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
        success: true,
        updated: 1,
        failed: 1,
        message: 'Sincronização finalizada com sucesso'
      })
    })
  })

  describe('previewGithubData', () => {
    it('should return 400 if url query parameter is missing', async () => {
      mockContext.req.query.mockReturnValue(undefined)

      const result = await previewGithubData(mockContext)

      expect(result.status).toBe(400)
      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'A URL do repositório é obrigatória' }, 400
      )
    })

    it('should return 404 if fetchGithubProjectStats returns null', async () => {
      mockContext.req.query.mockReturnValue('https://github.com/user/invalid')
      vi.mocked(fetchGithubProjectStats).mockResolvedValue(null)

      const result = await previewGithubData(mockContext)

      expect(result.status).toBe(404)
      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Não foi possível encontrar as estatísticas. Verifique se o repositório é público e se a URL está correta.' }, 404
      )
    })

    it('should return 200 and stats if repository is found', async () => {
      const mockStats = { stars: 5, languages: { TS: 100 }, topics: ['react'] }
      mockContext.req.query.mockReturnValue('https://github.com/user/valid')
      vi.mocked(fetchGithubProjectStats).mockResolvedValue(mockStats as any)

      const result = await previewGithubData(mockContext)

      expect(result.status).toBe(200)
      expect(mockContext.json).toHaveBeenCalledWith(mockStats, 200)
    })

    it('should return 500 if an unexpected error occurs', async () => {
      mockContext.req.query.mockReturnValue('https://github.com/user/valid')
      vi.mocked(fetchGithubProjectStats).mockRejectedValue(new Error('Network error'))

      const result = await previewGithubData(mockContext)

      expect(result.status).toBe(500)
      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro interno ao tentar buscar dados do GitHub', error: 'Network error' }, 500
      )
    })
  })
})
