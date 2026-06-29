import { describe, it, expect } from 'vitest'
import { educationSchema } from '../../schemas/educations.schema.js'

describe('Education Zod Schema', () => {
  const validPayload = {
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    type: 'college',
    durationHours: 1200,
    imageUrl: 'https://site.com/image.png',
    certificateUrl: 'https://site.com/certificate.pdf',
    status: 'completed',
    translations: [
      {
        language: 'en',
        name: 'Systems Analysis',
        institution: 'Tech University',
        description: 'A comprehensive degree program.',
      },
    ],
  }

  it('should validate a correct payload successfully', () => {
    const result = educationSchema.safeParse(validPayload)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validPayload)
    }
  })

  it('should validate a correct payload without optional fields', () => {
    const minimalPayload = {
      startDate: '2024-01-01',
      type: 'course',
      status: 'in_progress',
      translations: [
        {
          language: 'pt',
          name: 'Web Dev',
          institution: 'Online Academy',
          description: 'A very long description here.',
        },
      ],
    }

    const result = educationSchema.safeParse(minimalPayload)

    expect(result.success).toBe(true)
  })

  it('should fail and block the request if unallowed fields are sent', () => {
    const payloadWithExtraFields = {
      ...validPayload,
      id: 'fake-uuid-123',
      createdAt: '2026-06-26T00:00:00.000Z',
    }

    const result = educationSchema.safeParse(payloadWithExtraFields)

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

  it('should fail if URLs do not have a valid format or protocol', () => {
    const invalidUrlPayload = { ...validPayload, imageUrl: 'htt://site.com/image.png' }

    const result = educationSchema.safeParse(invalidUrlPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('educations.error.image_url')
    }
  })

  it('should fail if the translations array is empty', () => {
    const emptyTranslationsPayload = { ...validPayload, translations: [] }

    const result = educationSchema.safeParse(emptyTranslationsPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].code).toBe('too_small')
    }
  })

  it('should fail if translation data does not meet the minimum length', () => {
    const shortTranslationPayload = {
      ...validPayload,
      translations: [
        { language: 'e', name: 'A', institution: 'B', description: 'Short' }
      ]
    }

    const result = educationSchema.safeParse(shortTranslationPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('should fail if type enum is invalid', () => {
    const invalidTypePayload = { ...validPayload, type: 'invalid-type' }

    const result = educationSchema.safeParse(invalidTypePayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('educations.error.type')
    }
  })
})
