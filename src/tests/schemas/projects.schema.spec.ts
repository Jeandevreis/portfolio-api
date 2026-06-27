import { describe, it, expect } from 'vitest'
import { projectSchema } from '../../schemas/projects.schema.js'

describe('Projects Zod Schema', () => {
  const validPayload = {
    imageUrl: 'https://site.com/image.png',
    liveUrl: 'https://site.com',
    repoUrl: 'https://github.com/user/repo',
    translations: [
      {
        language: 'en',
        title: 'Valid title',
        description: 'Description with more than ten characters',
      },
    ],
    githubStats: {
      stars: 15,
      languages: ['TypeScript', 'JavaScript'],
      topics: ['api', 'backend'],
    },
  }

  it('should validate a correct payload successfully', () => {
    const result = projectSchema.safeParse(validPayload)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validPayload)
    }
  })

  it('should validate a correct payload without optional fields', () => {
    const minimalPayload = {
      translations: [
        {
          language: 'en',
          title: 'Valid title',
          description: 'Description with more than ten characters',
        },
      ],
    }

    const result = projectSchema.safeParse(minimalPayload)

    expect(result.success).toBe(true)
  })

  it('should fail and block the request if unallowed fields are sent', () => {
    const payloadWithExtraFields = {
      ...validPayload,
      id: 'fake-uuid-123',
      createdAt: '2026-06-26T00:00:00.000Z',
    }

    const result = projectSchema.safeParse(payloadWithExtraFields)

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
    const invalidUrlPayload = { ...validPayload, repoUrl: 'github.com/user/repo' }

    const result = projectSchema.safeParse(invalidUrlPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('projects.error.repo_url')
    }
  })

  it('should fail if the translations array is empty', () => {
    const emptyTranslationsPayload = { ...validPayload, translations: [] }

    const result = projectSchema.safeParse(emptyTranslationsPayload)

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

    const result = projectSchema.safeParse(shortTranslationPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('should fail if githubStats contains invalid types', () => {
    const invalidStatsPayload = {
      ...validPayload,
      githubStats: {
        stars: -5,
        languages: 'TypeScript',
        topics: ['api']
      }
    }

    const result = projectSchema.safeParse(invalidStatsPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(2)
    }
  })
})
