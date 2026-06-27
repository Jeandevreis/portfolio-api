import { describe, it, expect, vi, beforeEach } from 'vitest'

import { getCloudinarySignature } from '../../controllers/upload.controller.js'
import { generateSignature } from '../../services/cloudinary.service.js'

vi.mock('../../services/cloudinary.service.js', () => ({
  generateSignature: vi.fn()
}))

describe('Upload Controller', () => {
  let mockContext: any

  const validPayload = {
    folder: 'projects',
    identifier: 'proj-123'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockContext = {
      req: {
        json: vi.fn()
      },
      json: vi.fn((data, status = 200) => ({ data, status }))
    }
  })

  it('should return 500 if folder or identifier are missing due to schema validation', async () => {
    mockContext.req.json.mockResolvedValue({})

    const result = await getCloudinarySignature(mockContext)

    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'cloudinary.error.signature' }),
      500
    )
    expect(result.status).toBe(500)
  })

  it('should return 500 if folder is not allowed due to schema validation', async () => {
    mockContext.req.json.mockResolvedValue({
      folder: 'invalid_folder',
      identifier: 'proj-123'
    })

    const result = await getCloudinarySignature(mockContext)

    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'cloudinary.error.signature' }),
      500
    )
    expect(result.status).toBe(500)
  })

  it('should return 422 if signature generation fails', async () => {
    mockContext.req.json.mockResolvedValue(validPayload)
    vi.mocked(generateSignature).mockReturnValue(undefined as any)

    const result = await getCloudinarySignature(mockContext)

    expect(mockContext.json).toHaveBeenCalledWith(
      { error: 'cloudinary.error.generate', message: 'Signature generation failed' },
      422
    )
    expect(result.status).toBe(422)
  })

  it('should return 200 and signature data if valid folder and identifier are provided', async () => {
    mockContext.req.json.mockResolvedValue(validPayload)

    const mockSignatureData = {
      cloudName: 'mock-cloud',
      apiKey: 'mock-key',
      timestamp: 1715000000,
      signature: 'mock-signature',
      publicId: 'projects/proj-123'
    }

    vi.mocked(generateSignature).mockReturnValue(mockSignatureData)

    const result = await getCloudinarySignature(mockContext)

    expect(generateSignature).toHaveBeenCalledWith('projects', 'proj-123')
    expect(mockContext.json).toHaveBeenCalledWith(mockSignatureData, 200)
    expect(result.status).toBe(200)
  })
})
