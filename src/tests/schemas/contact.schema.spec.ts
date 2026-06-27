import { describe, it, expect } from 'vitest'
import { contactSchema } from '../../schemas/contact.schema.js'

describe('Contact Zod Schema', () => {
  const validPayload = {
    name: 'John Doe',
    company: 'Acme Corp',
    email: 'john@example.com',
    whatsapp: '1234567890',
    message: 'Hello, this is a valid message.',
  }

  it('should validate a correct payload successfully with both email and whatsapp', () => {
    const result = contactSchema.safeParse(validPayload)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validPayload)
    }
  })

  it('should validate successfully when only email is provided and whatsapp is empty', () => {
    const payloadWithEmailOnly = {
      ...validPayload,
      whatsapp: '',
    }

    const result = contactSchema.safeParse(payloadWithEmailOnly)

    expect(result.success).toBe(true)
  })

  it('should validate successfully when only whatsapp is provided and email is empty', () => {
    const payloadWithWhatsappOnly = {
      ...validPayload,
      email: '',
    }

    const result = contactSchema.safeParse(payloadWithWhatsappOnly)

    expect(result.success).toBe(true)
  })

  it('should validate successfully when email is omitted and whatsapp is provided', () => {
    const { email, ...payloadWithoutEmail } = validPayload

    const result = contactSchema.safeParse(payloadWithoutEmail)

    expect(result.success).toBe(true)
  })

  it('should validate successfully when whatsapp is omitted and email is provided', () => {
    const { whatsapp, ...payloadWithoutWhatsapp } = validPayload

    const result = contactSchema.safeParse(payloadWithoutWhatsapp)

    expect(result.success).toBe(true)
  })

  it('should fail if both email and whatsapp are missing', () => {
    const { email, whatsapp, ...payloadMissingBoth } = validPayload

    const result = contactSchema.safeParse(payloadMissingBoth)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('contact.error.email_or_whatsapp')
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('should fail if both email and whatsapp are empty strings', () => {
    const payloadEmptyBoth = {
      ...validPayload,
      email: '',
      whatsapp: '',
    }

    const result = contactSchema.safeParse(payloadEmptyBoth)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('contact.error.email_or_whatsapp')
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('should fail if name is too short', () => {
    const shortNamePayload = { ...validPayload, name: 'Jo' }

    const result = contactSchema.safeParse(shortNamePayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('contact.error.name')
    }
  })

  it('should fail if company is too short', () => {
    const shortCompanyPayload = { ...validPayload, company: 'Ac' }

    const result = contactSchema.safeParse(shortCompanyPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('contact.error.company')
    }
  })

  it('should fail if email has an invalid format', () => {
    const invalidEmailPayload = { ...validPayload, email: 'john@example' }

    const result = contactSchema.safeParse(invalidEmailPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('contact.error.email')
    }
  })

  it('should fail if whatsapp is too short', () => {
    const shortWhatsappPayload = { ...validPayload, whatsapp: '123456789' }

    const result = contactSchema.safeParse(shortWhatsappPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('contact.error.whatsapp')
    }
  })

  it('should fail if message is too short', () => {
    const shortMessagePayload = { ...validPayload, message: 'Too short' }

    const result = contactSchema.safeParse(shortMessagePayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('contact.error.message')
    }
  })

  it('should fail if required core fields are completely missing', () => {
    const emptyPayload = {
      email: 'john@example.com'
    }

    const result = contactSchema.safeParse(emptyPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      const issuePaths = result.error.issues.map(issue => issue.path[0])
      expect(issuePaths).toContain('name')
      expect(issuePaths).toContain('company')
      expect(issuePaths).toContain('message')
    }
  })
})
