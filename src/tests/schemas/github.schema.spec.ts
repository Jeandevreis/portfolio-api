import { describe, it, expect } from 'vitest'
import { githubSchema } from '../../schemas/github.schema.js'

describe('Github Zod Schema', () => {
  const validPayload = {
    repoUrl: 'https://github.com/user/repo',
  }

  it('should validate a correct payload successfully', () => {
    const result = githubSchema.safeParse(validPayload)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validPayload)
    }
  })

  it('should fail and block the request if unallowed fields are sent', () => {
    const payloadWithExtraFields = {
      ...validPayload,
      extraField: 'not-allowed',
    }

    const result = githubSchema.safeParse(payloadWithExtraFields)

    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues[0]
      expect(issue.code).toBe('unrecognized_keys')

      if (issue.code === 'unrecognized_keys') {
        expect(issue.keys).toContain('extraField')
      }
    }
  })

  it('should fail if repoUrl is missing', () => {
    const missingUrlPayload = {}

    const result = githubSchema.safeParse(missingUrlPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      const issuePaths = result.error.issues.map(issue => issue.path[0])
      expect(issuePaths).toContain('repoUrl')
    }
  })

  it('should fail if repoUrl has an invalid format', () => {
    const invalidUrlPayload = {
      repoUrl: 'github.com/user/repo',
    }

    const result = githubSchema.safeParse(invalidUrlPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('github.error.repo_url')
    }
  })

  it('should fail if repoUrl is an empty string', () => {
    const emptyUrlPayload = {
      repoUrl: '',
    }

    const result = githubSchema.safeParse(emptyUrlPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('github.error.repo_url')
    }
  })

  it('should fail if repoUrl is just a protocol without host', () => {
    const protocolOnlyPayload = {
      repoUrl: 'https://',
    }

    const result = githubSchema.safeParse(protocolOnlyPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('github.error.repo_url')
    }
  })
})
