import { describe, it, expect } from 'vitest'
import { serviceSchema } from '../../schemas/services.schema.js'

describe('Services Zod Schema', () => {
  const validPayload = {
    link: 'https://site.com',
    imageUrl: 'https://site.com/image.png',
    translations: [
      {
        language: 'en',
        title: 'Valid title',
        description: 'Description with more than ten characters',
      },
    ],
  }


  it('should validate a correct payload successfully', () => {
    const result = serviceSchema.safeParse(validPayload)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validPayload)
    }
  })

  it('should fail and block the request if unallowed fields are sent', () => {
    const payloadWithExtraFields = {
      ...validPayload,
      id: 'fake-uuid-123',
      createdAt: '2026-06-26T00:00:00.000Z',
      extraField: true
    }

    const result = serviceSchema.safeParse(payloadWithExtraFields)

    expect(result.success).toBe(false)

    if (!result.success) {
      const issue = result.error.issues[0]
      expect(issue.code).toBe('unrecognized_keys')

      if (issue.code === 'unrecognized_keys') {
        expect(issue.keys).toContain('id')
        expect(issue.keys).toContain('createdAt')
      }
    }
  })

  it('should fail if URLs do not have a valid format', () => {
    const invalidUrlPayload = { ...validPayload, link: 'www.site.com' }

    const result = serviceSchema.safeParse(invalidUrlPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('services.error.link')
    }
  })

  it('should fail if the translations array is empty', () => {
    const emptyTranslationsPayload = { ...validPayload, translations: [] }

    const result = serviceSchema.safeParse(emptyTranslationsPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].code).toBe('too_small')
    }
  })

  it('should fail if translation data does not meet the minimum length', () => {
    const shortTranslationPayload = {
      ...validPayload,
      translations: [
        { language: 'e', title: 'A', description: 'Short' }
      ]
    }

    const result = serviceSchema.safeParse(shortTranslationPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(3)
    }
  })
})
