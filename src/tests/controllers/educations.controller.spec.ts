import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  getEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation
} from '../../controllers/educations.controller.js'

import {
  findAllEducations,
  findEducationById,
  createEducationRecord,
  updateEducationRecord,
  deleteEducationRecord
} from '../../repositories/educations.repository.js'

vi.mock('../../repositories/educations.repository.js', () => ({
  findAllEducations: vi.fn(),
  findEducationById: vi.fn(),
  createEducationRecord: vi.fn(),
  updateEducationRecord: vi.fn(),
  deleteEducationRecord: vi.fn()
}))

describe('Educations Controller', () => {
  let mockContext: any

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

    mockContext = {
      req: {
        param: vi.fn(),
        json: vi.fn()
      },
      json: vi.fn((data, status = 200) => ({ data, status }))
    }
  })

  describe('getEducations', () => {
    it('should return a list of educations with status 200', async () => {
      const mockData = [{ id: '1', type: 'course' }]
      vi.mocked(findAllEducations).mockResolvedValue(mockData as any)

      const result = await getEducations(mockContext)

      expect(findAllEducations).toHaveBeenCalled()
      expect(mockContext.json).toHaveBeenCalledWith(mockData, 200)
      expect(result.status).toBe(200)
    })

    it('should return 500 if an error occurs during retrieval', async () => {
      vi.mocked(findAllEducations).mockRejectedValue(new Error('Database error'))

      const result = await getEducations(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'educations.error.list', message: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('getEducationById', () => {
    it('should return the education with status 200 if found', async () => {
      const mockData = { id: '1', type: 'course' }
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findEducationById).mockResolvedValue(mockData as any)

      const result = await getEducationById(mockContext)

      expect(findEducationById).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith(mockData, 200)
      expect(result.status).toBe(200)
    })

    it('should return 404 if education is not found', async () => {
      mockContext.req.param.mockReturnValue('99')
      vi.mocked(findEducationById).mockResolvedValue(undefined as any)

      const result = await getEducationById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'educations.error.not_found', message: 'Education record not found' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 500 if an error occurs during retrieval by id', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findEducationById).mockRejectedValue(new Error('Database error'))

      const result = await getEducationById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'educations.error.get_by_id', message: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('createEducation', () => {
    it('should create an education and return 201', async () => {
      const mockCreatedRecord = { id: '1', ...validPayload }
      const { translations, ...expectedData } = validPayload

      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(createEducationRecord).mockResolvedValue(mockCreatedRecord as any)

      const result = await createEducation(mockContext)

      expect(createEducationRecord).toHaveBeenCalledWith(expectedData, translations)
      expect(mockContext.json).toHaveBeenCalledWith(mockCreatedRecord, 201)
      expect(result.status).toBe(201)
    })

    it('should return 422 if the repository fails to create the record', async () => {
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(createEducationRecord).mockResolvedValue(null as any)

      const result = await createEducation(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'educations.error.create', message: 'Education not created' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if validation or creation throws an error', async () => {
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(createEducationRecord).mockRejectedValue(new Error('Creation failed'))

      const result = await createEducation(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'educations.error.create', message: 'Creation failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('updateEducation', () => {
    it('should update an education and return 200 with the updated record', async () => {
      mockContext.req.param.mockReturnValue('1')
      const mockUpdatedRecord = { id: '1', ...validPayload }
      const { translations, ...expectedData } = validPayload

      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateEducationRecord).mockResolvedValue(mockUpdatedRecord as any)

      const result = await updateEducation(mockContext)

      expect(updateEducationRecord).toHaveBeenCalledWith('1', expectedData, translations)
      expect(mockContext.json).toHaveBeenCalledWith(mockUpdatedRecord, 200)
      expect(result.status).toBe(200)
    })

    it('should return 422 if the repository fails to update the record', async () => {
      mockContext.req.param.mockReturnValue('1')
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateEducationRecord).mockResolvedValue(null as any)

      const result = await updateEducation(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'educations.error.update', message: 'Education not updated' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if validation or update throws an error', async () => {
      mockContext.req.param.mockReturnValue('1')
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateEducationRecord).mockRejectedValue(new Error('Update failed'))

      const result = await updateEducation(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'educations.error.update', message: 'Update failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('deleteEducation', () => {
    it('should delete an education and return 200 with the deleted record', async () => {
      mockContext.req.param.mockReturnValue('1')
      const mockDeletedRecord = { id: '1' }
      vi.mocked(deleteEducationRecord).mockResolvedValue(mockDeletedRecord as any)

      const result = await deleteEducation(mockContext)

      expect(deleteEducationRecord).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith(mockDeletedRecord, 200)
      expect(result.status).toBe(200)
    })

    it('should return 422 if the repository fails to delete the record', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteEducationRecord).mockResolvedValue(null as any)

      const result = await deleteEducation(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'educations.error.delete', message: 'Education not deleted' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if deletion throws an error', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteEducationRecord).mockRejectedValue(new Error('Deletion failed'))

      const result = await deleteEducation(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'educations.error.delete', message: 'Deletion failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })
})
