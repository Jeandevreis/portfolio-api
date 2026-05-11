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
    it('should return a list of educations', async () => {
      const mockData = [{ id: '1', type: 'Course' }]
      vi.mocked(findAllEducations).mockResolvedValue(mockData as any)

      const result = await getEducations(mockContext)

      expect(findAllEducations).toHaveBeenCalled()
      expect(mockContext.json).toHaveBeenCalledWith(mockData)
      expect(result.status).toBe(200)
    })

    it('should return 500 if an error occurs', async () => {
      vi.mocked(findAllEducations).mockRejectedValue(new Error('Database error'))

      const result = await getEducations(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao buscar educações', error: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('getEducationById', () => {
    it('should return the education if found', async () => {
      const mockData = { id: '1', type: 'Course' }
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findEducationById).mockResolvedValue(mockData as any)

      const result = await getEducationById(mockContext)

      expect(findEducationById).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith(mockData)
      expect(result.status).toBe(200)
    })

    it('should return 404 if education is not found', async () => {
      mockContext.req.param.mockReturnValue('99')
      vi.mocked(findEducationById).mockResolvedValue(undefined as any)

      const result = await getEducationById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Registro de educação não encontrado' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 500 if an error occurs', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findEducationById).mockRejectedValue(new Error('Database error'))

      const result = await getEducationById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao procurar educação', error: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('createEducation', () => {
    it('should create an education and return 201', async () => {
      const mockBody = { type: 'Course', translations: [{ language: 'en' }] }
      const mockCreatedRecord = { id: '1', type: 'Course' }

      mockContext.req.json.mockResolvedValue(mockBody)
      vi.mocked(createEducationRecord).mockResolvedValue(mockCreatedRecord as any)

      const result = await createEducation(mockContext)

      expect(createEducationRecord).toHaveBeenCalledWith({ type: 'Course' }, [{ language: 'en' }])
      expect(mockContext.json).toHaveBeenCalledWith(mockCreatedRecord, 201)
      expect(result.status).toBe(201)
    })

    it('should return 500 if creation fails', async () => {
      mockContext.req.json.mockResolvedValue({})
      vi.mocked(createEducationRecord).mockRejectedValue(new Error('Creation failed'))

      const result = await createEducation(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro interno ao salvar educação', error: 'Creation failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('updateEducation', () => {
    it('should update an education and return success message', async () => {
      mockContext.req.param.mockReturnValue('1')
      const mockBody = { type: 'Degree', translations: [{ language: 'pt' }] }

      mockContext.req.json.mockResolvedValue(mockBody)
      vi.mocked(updateEducationRecord).mockResolvedValue(undefined as any)

      const result = await updateEducation(mockContext)

      expect(updateEducationRecord).toHaveBeenCalledWith('1', { type: 'Degree' }, [{ language: 'pt' }])
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Educação atualizada com sucesso' })
      expect(result.status).toBe(200)
    })

    it('should return 500 if update fails', async () => {
      mockContext.req.param.mockReturnValue('1')
      mockContext.req.json.mockResolvedValue({})
      vi.mocked(updateEducationRecord).mockRejectedValue(new Error('Update failed'))

      const result = await updateEducation(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao atualizar educação', error: 'Update failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('deleteEducation', () => {
    it('should delete an education and return success message', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteEducationRecord).mockResolvedValue(undefined as any)

      const result = await deleteEducation(mockContext)

      expect(deleteEducationRecord).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Registro de educação removido com sucesso' })
      expect(result.status).toBe(200)
    })

    it('should return 500 if deletion fails', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteEducationRecord).mockRejectedValue(new Error('Deletion failed'))

      const result = await deleteEducation(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Erro ao deletar educação', error: 'Deletion failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })
})
