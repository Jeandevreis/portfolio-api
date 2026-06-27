import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendContactEmail } from '../../controllers/contact.controller.js'
import { sendContactFormEmail } from '../../services/resend.service.js'

vi.mock('../../services/resend.service.js', () => ({
  sendContactFormEmail: vi.fn()
}))

describe('Contact Controller', () => {
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

  it('should return 500 if name, company, or message are missing due to schema validation', async () => {
    mockContext.req.json.mockResolvedValue({
      name: 'John',
      email: 'john@example.com'
    })

    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(500)
    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'contact.error.send' }),
      500
    )
  })

  it('should return 500 if neither email nor whatsapp is provided due to schema validation', async () => {
    mockContext.req.json.mockResolvedValue({
      name: 'John',
      company: 'Acme Corp',
      message: 'Hello, this is a valid message length'
    })

    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(500)
    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'contact.error.send' }),
      500
    )
  })

  it('should return 422 if the resend service fails to send the email', async () => {
    mockContext.req.json.mockResolvedValue({
      name: 'John',
      company: 'Acme Corp',
      message: 'Hello, this is a valid message length',
      email: 'john@example.com'
    })

    vi.mocked(sendContactFormEmail).mockResolvedValue({
      success: false,
      error: 'Resend API Error'
    } as any)

    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(422)
    expect(mockContext.json).toHaveBeenCalledWith(
      { error: 'contact.error.send', message: 'Resend API Error' },
      422
    )
  })

  it('should return 200 and data if email is sent correctly', async () => {
    const validContactPayload = {
      name: 'John',
      company: 'Acme Corp',
      message: 'Hello, this is a valid message length',
      whatsapp: '1234567890'
    }

    mockContext.req.json.mockResolvedValue(validContactPayload)

    const mockServiceResponseData = { id: 'email-id-123' }

    vi.mocked(sendContactFormEmail).mockResolvedValue({
      success: true,
      data: mockServiceResponseData
    } as any)

    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(200)
    expect(mockContext.json).toHaveBeenCalledWith(mockServiceResponseData, 200)
    expect(sendContactFormEmail).toHaveBeenCalledWith(validContactPayload)
  })

  it('should return 500 if an unexpected error is thrown', async () => {
    mockContext.req.json.mockRejectedValue(new Error('Unexpected Parse Error'))

    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(500)
    expect(mockContext.json).toHaveBeenCalledWith(
      { error: 'contact.error.send', message: 'Unexpected Parse Error' },
      500
    )
  })
})
