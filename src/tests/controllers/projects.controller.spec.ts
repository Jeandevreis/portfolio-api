import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../../controllers/projects.controller.js'
import {
  findAllProjects,
  findProjectById,
  createProjectRecord,
  updateProjectRecord,
  deleteProjectRecord
} from '../../repositories/projects.repository.js'

vi.mock('../../repositories/projects.repository.js', () => ({
  findAllProjects: vi.fn(),
  findProjectById: vi.fn(),
  createProjectRecord: vi.fn(),
  updateProjectRecord: vi.fn(),
  deleteProjectRecord: vi.fn()
}))

describe('Projects Controller', () => {
  let mockContext: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockContext = {
      req: {
        param: vi.fn(),
        json: vi.fn()
      },
      json: vi.fn((data, status = 200) => ({ data, status }))
    }
  })

  describe('getProjects', () => {
    it('should return a list of projects', async () => {
      const mockData = [{ id: '1', repoUrl: 'https://github.com/repo' }]
      vi.mocked(findAllProjects).mockResolvedValue(mockData as any)

      const result = await getProjects(mockContext)

      expect(findAllProjects).toHaveBeenCalled()
      expect(mockContext.json).toHaveBeenCalledWith(mockData)
      expect(result.status).toBe(200)
    })

    it('should return 500 if an error occurs', async () => {
      vi.mocked(findAllProjects).mockRejectedValue(new Error('Database error'))

      const result = await getProjects(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao buscar projetos', error: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('getProjectById', () => {
    it('should return the project if found', async () => {
      const mockData = { id: '1', repoUrl: 'https://github.com/repo' }
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findProjectById).mockResolvedValue(mockData as any)

      const result = await getProjectById(mockContext)

      expect(findProjectById).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith(mockData)
      expect(result.status).toBe(200)
    })

    it('should return 404 if project is not found', async () => {
      mockContext.req.param.mockReturnValue('99')
      vi.mocked(findProjectById).mockResolvedValue(undefined as any)

      const result = await getProjectById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Projeto não encontrado' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 500 if an error occurs', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findProjectById).mockRejectedValue(new Error('Database error'))

      const result = await getProjectById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao procurar projeto', error: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('createProject', () => {
    it('should create a project and return 201', async () => {
      const mockBody = {
        imageUrl: 'http://img.com/1.png',
        translations: [{ language: 'en' }],
        githubStats: { stars: 10 }
      }
      const mockCreatedRecord = { id: '1', imageUrl: 'http://img.com/1.png' }

      mockContext.req.json.mockResolvedValue(mockBody)
      vi.mocked(createProjectRecord).mockResolvedValue(mockCreatedRecord as any)

      const result = await createProject(mockContext)

      expect(createProjectRecord).toHaveBeenCalledWith(
        { imageUrl: 'http://img.com/1.png' },
        [{ language: 'en' }],
        { stars: 10 }
      )
      expect(mockContext.json).toHaveBeenCalledWith(mockCreatedRecord, 201)
      expect(result.status).toBe(201)
    })

    it('should return 500 if creation fails', async () => {
      mockContext.req.json.mockResolvedValue({})
      vi.mocked(createProjectRecord).mockRejectedValue(new Error('Creation failed'))

      const result = await createProject(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro interno ao salvar projecto', error: 'Creation failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('updateProject', () => {
    it('should update a project and return success message', async () => {
      mockContext.req.param.mockReturnValue('1')
      const mockBody = {
        liveUrl: 'https://site.com',
        translations: [{ language: 'pt' }],
        githubStats: { stars: 20 }
      }

      mockContext.req.json.mockResolvedValue(mockBody)
      vi.mocked(updateProjectRecord).mockResolvedValue(undefined as any)

      const result = await updateProject(mockContext)

      expect(updateProjectRecord).toHaveBeenCalledWith(
        '1',
        { liveUrl: 'https://site.com' },
        [{ language: 'pt' }],
        { stars: 20 }
      )
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Projeto atualizado com sucesso' })
      expect(result.status).toBe(200)
    })

    it('should return 500 if update fails', async () => {
      mockContext.req.param.mockReturnValue('1')
      mockContext.req.json.mockResolvedValue({})
      vi.mocked(updateProjectRecord).mockRejectedValue(new Error('Update failed'))

      const result = await updateProject(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao atualizar projeto', error: 'Update failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('deleteProject', () => {
    it('should delete a project and return success message', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteProjectRecord).mockResolvedValue(undefined as any)

      const result = await deleteProject(mockContext)

      expect(deleteProjectRecord).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Projeto removido com sucesso' })
      expect(result.status).toBe(200)
    })

    it('should return 500 if deletion fails', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteProjectRecord).mockRejectedValue(new Error('Deletion failed'))

      const result = await deleteProject(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao remover projeto', error: 'Deletion failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })
})
