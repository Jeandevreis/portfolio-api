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

  const validPayload = {
    imageUrl: 'https://site.com/image.png',
    liveUrl: 'https://site.com',
    translations: [
      {
        language: 'en',
        title: 'Valid Project',
        description: 'This is a description with enough characters'
      }
    ],
    githubStats: { stars: 10 }
  }

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
    it('should return a list of projects with status 200', async () => {
      const mockData = [{ id: '1', liveUrl: 'https://site.com' }]
      vi.mocked(findAllProjects).mockResolvedValue(mockData as any)

      const result = await getProjects(mockContext)

      expect(findAllProjects).toHaveBeenCalled()
      expect(mockContext.json).toHaveBeenCalledWith(mockData, 200)
      expect(result.status).toBe(200)
    })

    it('should return 500 if an error occurs during retrieval', async () => {
      vi.mocked(findAllProjects).mockRejectedValue(new Error('Database error'))

      const result = await getProjects(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'projects.error.list', message: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('getProjectById', () => {
    it('should return the project with status 200 if found', async () => {
      const mockData = { id: '1', liveUrl: 'https://site.com' }
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findProjectById).mockResolvedValue(mockData as any)

      const result = await getProjectById(mockContext)

      expect(findProjectById).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith(mockData, 200)
      expect(result.status).toBe(200)
    })

    it('should return 404 if project is not found', async () => {
      mockContext.req.param.mockReturnValue('99')
      vi.mocked(findProjectById).mockResolvedValue(undefined as any)

      const result = await getProjectById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'projects.error.not_found', message: 'Project not found' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 500 if an error occurs during retrieval by id', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findProjectById).mockRejectedValue(new Error('Database error'))

      const result = await getProjectById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'projects.error.get_by_id', message: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('createProject', () => {
    it('should create a project and return 201 with the created record', async () => {
      const mockCreatedRecord = { id: '1', ...validPayload }
      const { translations, ...expectedData } = validPayload

      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(createProjectRecord).mockResolvedValue(mockCreatedRecord as any)

      const result = await createProject(mockContext)

      expect(createProjectRecord).toHaveBeenCalledWith(expectedData, translations)
      expect(mockContext.json).toHaveBeenCalledWith(mockCreatedRecord, 201)
      expect(result.status).toBe(201)
    })

    it('should return 422 if the repository fails to create the record', async () => {
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(createProjectRecord).mockResolvedValue(null as any)

      const result = await createProject(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'projects.error.create', message: 'Project not created' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if validation or creation throws an error', async () => {
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(createProjectRecord).mockRejectedValue(new Error('Creation failed'))

      const result = await createProject(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'projects.error.create', message: 'Creation failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('updateProject', () => {
    it('should update a project and return 200 with the updated record', async () => {
      mockContext.req.param.mockReturnValue('1')
      const mockUpdatedRecord = { id: '1', ...validPayload }
      const { translations, ...expectedData } = validPayload

      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateProjectRecord).mockResolvedValue(mockUpdatedRecord as any)

      const result = await updateProject(mockContext)

      expect(updateProjectRecord).toHaveBeenCalledWith('1', expectedData, translations)
      expect(mockContext.json).toHaveBeenCalledWith(mockUpdatedRecord, 200)
      expect(result.status).toBe(200)
    })

    it('should return 422 if the repository fails to update the record', async () => {
      mockContext.req.param.mockReturnValue('1')
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateProjectRecord).mockResolvedValue(null as any)

      const result = await updateProject(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'projects.error.update', message: 'Project not updated' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if validation or update throws an error', async () => {
      mockContext.req.param.mockReturnValue('1')
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateProjectRecord).mockRejectedValue(new Error('Update failed'))

      const result = await updateProject(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'projects.error.update', message: 'Update failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('deleteProject', () => {
    it('should delete a project and return 200 with the deleted record', async () => {
      mockContext.req.param.mockReturnValue('1')
      const mockDeletedRecord = { id: '1' }
      vi.mocked(deleteProjectRecord).mockResolvedValue(mockDeletedRecord as any)

      const result = await deleteProject(mockContext)

      expect(deleteProjectRecord).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith(mockDeletedRecord, 200)
      expect(result.status).toBe(200)
    })

    it('should return 422 if the repository fails to delete the record', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteProjectRecord).mockResolvedValue(null as any)

      const result = await deleteProject(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'projects.error.delete', message: 'Project not deleted' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if deletion throws an error', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteProjectRecord).mockRejectedValue(new Error('Deletion failed'))

      const result = await deleteProject(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'projects.error.delete', message: 'Deletion failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })
})
