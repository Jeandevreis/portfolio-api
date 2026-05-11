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

  it('should return 400 if name, company, or message are missing', async () => {
    mockContext.req.json.mockResolvedValue({
      name: 'John',
      email: 'john@example.com'
    })

    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(400)
    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }), 400
    )
  })

  it('should return 400 if neither email nor whatsapp is provided', async () => {
    mockContext.req.json.mockResolvedValue({
      name: 'John',
      company: 'Acme Corp',
      message: 'Hello'
    })

    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(400)
    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'You must provide either an email or a whatsapp number' }), 400
    )
  })

  it('should return 500 if the resend service fails', async () => {
    mockContext.req.json.mockResolvedValue({
      name: 'John',
      company: 'Acme Corp',
      message: 'Hello',
      email: 'john@example.com'
    })

    vi.mocked(sendContactFormEmail).mockResolvedValue({ success: false, error: new Error('Resend API Error') })
    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(500)
    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Error sending email to the service.' }), 500
    )
  })

  it('should return 200 and success message if email is sent correctly', async () => {
    mockContext.req.json.mockResolvedValue({
      name: 'John',
      company: 'Acme Corp',
      message: 'Hello',
      whatsapp: '+123456789'
    })

    vi.mocked(sendContactFormEmail).mockResolvedValue({
      success: true,
      data: { id: 'email-id-123' } as any
    })

    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(200)

    expect(mockContext.json).toHaveBeenCalledWith({
      success: true,
      message: 'Email sent successfully!',
      data: { id: 'email-id-123' }
    })

    expect(sendContactFormEmail).toHaveBeenCalledWith({
      name: 'John',
      company: 'Acme Corp',
      message: 'Hello',
      whatsapp: '+123456789',
      email: undefined
    })
  })

  it('should return 500 if an unexpected error is thrown', async () => {
    mockContext.req.json.mockRejectedValue(new Error('Unexpected Parse Error'))

    const result = await sendContactEmail(mockContext)

    expect(result.status).toBe(500)
    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal server error.' }), 500
    )
  })
})
