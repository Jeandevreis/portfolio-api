import { describe, it, expect } from 'vitest'
import { cloudinarySignatureSchema } from '../../schemas/cloudinary.schema.js'

describe('Cloudinary Signature Zod Schema', () => {
  const validPayload = {
    folder: 'projects',
    identifier: 'project-123',
  }

  it('should validate a correct payload successfully', () => {
    const result = cloudinarySignatureSchema.safeParse(validPayload)

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

    const result = cloudinarySignatureSchema.safeParse(payloadWithExtraFields)

    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues[0]
      expect(issue.code).toBe('unrecognized_keys')

      if (issue.code === 'unrecognized_keys') {
        expect(issue.keys).toContain('extraField')
      }
    }
  })

  it('should fail if an invalid folder is provided', () => {
    const invalidFolderPayload = {
      ...validPayload,
      folder: 'invalid-folder',
    }

    const result = cloudinarySignatureSchema.safeParse(invalidFolderPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('cloudinary.error.invalid_folder')
    }
  })

  it('should fail if the folder is missing', () => {
    const validFolderPayload = {
      identifier: 'project-123',
    }

    const result = cloudinarySignatureSchema.safeParse(validFolderPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('cloudinary.error.invalid_folder')
    }
  })

  it('should fail if the folder is empty', () => {
    const emptyFolderPayload = {
      ...validPayload,
      folder: '',
    }

    const result = cloudinarySignatureSchema.safeParse(emptyFolderPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('cloudinary.error.invalid_folder')
    }
  })

  it('should fail if the identifier is empty', () => {
    const emptyIdentifierPayload = {
      ...validPayload,
      identifier: '',
    }

    const result = cloudinarySignatureSchema.safeParse(emptyIdentifierPayload)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('cloudinary.error.invalid_identifier')
    }
  })
})
