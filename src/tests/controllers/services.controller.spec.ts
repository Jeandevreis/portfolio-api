import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../../controllers/services.controller.js'

import {
  findAllServices,
  findServiceById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord
} from '../../repositories/services.repository.js'

vi.mock('../../repositories/services.repository.js', () => ({
  findAllServices: vi.fn(),
  findServiceById: vi.fn(),
  createServiceRecord: vi.fn(),
  updateServiceRecord: vi.fn(),
  deleteServiceRecord: vi.fn()
}))

describe('Services Controller', () => {
  let mockContext: any

  const validPayload = {
    link: 'https://site.com',
    imageUrl: 'https://site.com/image.png',
    translations: [
      {
        language: 'en',
        title: 'Valid Title',
        description: 'Description with sufficient characters'
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

  describe('getServices', () => {
    it('should return a list of services with status 200', async () => {
      const mockData = [{ id: '1', link: 'https://site.com' }]
      vi.mocked(findAllServices).mockResolvedValue(mockData as any)

      const result = await getServices(mockContext)

      expect(findAllServices).toHaveBeenCalled()
      expect(mockContext.json).toHaveBeenCalledWith(mockData, 200)
      expect(result.status).toBe(200)
    })

    it('should return 500 if an error occurs during retrieval', async () => {
      vi.mocked(findAllServices).mockRejectedValue(new Error('Database error'))

      const result = await getServices(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'services.error.list', message: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('getServiceById', () => {
    it('should return the service with status 200 if found', async () => {
      const mockData = { id: '1', link: 'https://site.com' }
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findServiceById).mockResolvedValue(mockData as any)

      const result = await getServiceById(mockContext)

      expect(findServiceById).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith(mockData, 200)
      expect(result.status).toBe(200)
    })

    it('should return 404 if service is not found', async () => {
      mockContext.req.param.mockReturnValue('99')
      vi.mocked(findServiceById).mockResolvedValue(undefined as any)

      const result = await getServiceById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'services.error.not_found', message: 'Service not found' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 500 if an error occurs during retrieval by id', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(findServiceById).mockRejectedValue(new Error('Database error'))

      const result = await getServiceById(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'services.error.get_by_id', message: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('createService', () => {
    it('should create a service and return 201 with the created record', async () => {
      const mockCreatedRecord = { id: '1', ...validPayload }
      const { translations, ...expectedData } = validPayload

      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(createServiceRecord).mockResolvedValue(mockCreatedRecord as any)

      const result = await createService(mockContext)

      expect(createServiceRecord).toHaveBeenCalledWith(expectedData, translations)
      expect(mockContext.json).toHaveBeenCalledWith(mockCreatedRecord, 201)
      expect(result.status).toBe(201)
    })

    it('should return 422 if the repository fails to create the record', async () => {
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(createServiceRecord).mockResolvedValue(null as any)

      const result = await createService(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'services.error.create', message: 'Service not created' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if validation or creation throws an error', async () => {
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(createServiceRecord).mockRejectedValue(new Error('Creation failed'))

      const result = await createService(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'services.error.create', message: 'Creation failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('updateService', () => {
    it('should update a service and return 200 with the updated record', async () => {
      mockContext.req.param.mockReturnValue('1')
      const mockUpdatedRecord = { id: '1', ...validPayload }
      const { translations, ...expectedData } = validPayload

      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateServiceRecord).mockResolvedValue(mockUpdatedRecord as any)

      const result = await updateService(mockContext)

      expect(updateServiceRecord).toHaveBeenCalledWith('1', expectedData, translations)
      expect(mockContext.json).toHaveBeenCalledWith(mockUpdatedRecord, 200)
      expect(result.status).toBe(200)
    })

    it('should return 422 if the repository fails to update the record', async () => {
      mockContext.req.param.mockReturnValue('1')
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateServiceRecord).mockResolvedValue(null as any)

      const result = await updateService(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'services.error.update', message: 'Service not updated' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if validation or update throws an error', async () => {
      mockContext.req.param.mockReturnValue('1')
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateServiceRecord).mockRejectedValue(new Error('Update failed'))

      const result = await updateService(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'services.error.update', message: 'Update failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('deleteService', () => {
    it('should delete a service and return 200 with the deleted record', async () => {
      mockContext.req.param.mockReturnValue('1')
      const mockDeletedRecord = { id: '1' }
      vi.mocked(deleteServiceRecord).mockResolvedValue(mockDeletedRecord as any)

      const result = await deleteService(mockContext)

      expect(deleteServiceRecord).toHaveBeenCalledWith('1')
      expect(mockContext.json).toHaveBeenCalledWith(mockDeletedRecord, 200)
      expect(result.status).toBe(200)
    })

    it('should return 422 if the repository fails to delete the record', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteServiceRecord).mockResolvedValue(null as any)

      const result = await deleteService(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'services.error.delete', message: 'Service not deleted' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if deletion throws an error', async () => {
      mockContext.req.param.mockReturnValue('1')
      vi.mocked(deleteServiceRecord).mockRejectedValue(new Error('Deletion failed'))

      const result = await deleteService(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'services.error.delete', message: 'Deletion failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })
})
