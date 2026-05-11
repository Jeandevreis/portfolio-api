import { describe, it, expect, vi, beforeEach } from 'vitest'

import { getCloudinarySignature } from '../../controllers/upload.controller.js'
import { generateSignature } from '../../services/cloudinary.service.js'

vi.mock('../../services/cloudinary.service.js', () => ({
  generateSignature: vi.fn()
}))

describe('Upload Controller', () => {
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

  it('should return 400 if projectTitle is missing', async () => {
    mockContext.req.query.mockReturnValue(undefined)

    const result = await getCloudinarySignature(mockContext)

    expect(mockContext.json).toHaveBeenCalledWith({ message: 'projectTitle is required' }, 400)
    expect(result.status).toBe(400)
  })

  it('should return 200 and signature data if projectTitle is provided', async () => {
    mockContext.req.query.mockReturnValue('Meu Super Projeto')

    const mockSignatureData = {
      cloudName: 'mock-cloud',
      apiKey: 'mock-key',
      timestamp: 1715000000,
      signature: 'mock-signature',
      publicId: 'projects/meu-super-projeto'
    }

    vi.mocked(generateSignature).mockReturnValue(mockSignatureData)

    const result = await getCloudinarySignature(mockContext)

    expect(generateSignature).toHaveBeenCalledWith('Meu Super Projeto')
    expect(mockContext.json).toHaveBeenCalledWith(mockSignatureData)
    expect(result.status).toBe(200)
  })
})
