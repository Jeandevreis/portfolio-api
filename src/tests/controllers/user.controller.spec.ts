import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as bcrypt from 'bcryptjs'

import {
  getProfile,
  updateProfile,
  changePassword
} from '../../controllers/user.controller.js'

import {
  findUserById,
  updateUserProfile,
  updateUserPassword
} from '../../repositories/users.repository.js'

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
  hash: vi.fn()
}))

vi.mock('../../repositories/users.repository.js', () => ({
  findUserById: vi.fn(),
  updateUserProfile: vi.fn(),
  updateUserPassword: vi.fn()
}))

describe('Users Controller', () => {
  let mockContext: any

  const mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: 'http://example.com/avatar.jpg',
    passwordHash: 'hashed-password',
    lockUntil: null,
    loginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const safeUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: 'http://example.com/avatar.jpg',
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockContext = {
      get: vi.fn().mockReturnValue({ id: 'user-123' }),
      req: {
        json: vi.fn()
      },
      json: vi.fn((data, status = 200) => ({ data, status }))
    }
  })

  describe('getProfile', () => {
    it('should return 404 if user is not found', async () => {
      vi.mocked(findUserById).mockResolvedValue(undefined as any)

      const result = await getProfile(mockContext)

      expect(findUserById).toHaveBeenCalledWith('user-123')
      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'users.error.not_found', message: 'User not found' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 200 and the user without sensitive data', async () => {
      vi.mocked(findUserById).mockResolvedValue(mockUser as any)

      const result = await getProfile(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(safeUser, 200)
      expect(result.status).toBe(200)
    })

    it('should return 500 if an error occurs', async () => {
      vi.mocked(findUserById).mockRejectedValue(new Error('Database error'))

      const result = await getProfile(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'users.error.get_profile', message: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('updateProfile', () => {
    const validUpdatePayload = { name: 'New Name', email: 'new@example.com' }

    it('should return 200 and the updated user without sensitive data', async () => {
      mockContext.req.json.mockResolvedValue(validUpdatePayload)

      const updatedUserMock = { ...mockUser, ...validUpdatePayload }
      vi.mocked(updateUserProfile).mockResolvedValue(updatedUserMock as any)

      const result = await updateProfile(mockContext)

      expect(updateUserProfile).toHaveBeenCalledWith('user-123', validUpdatePayload)

      const expectedSafeUser = { ...safeUser, ...validUpdatePayload }
      expect(mockContext.json).toHaveBeenCalledWith(expectedSafeUser, 200)
      expect(result.status).toBe(200)
    })

    it('should return 422 if profile is not updated', async () => {
      mockContext.req.json.mockResolvedValue(validUpdatePayload)
      vi.mocked(updateUserProfile).mockResolvedValue(null as any)

      const result = await updateProfile(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'users.error.update', message: 'Profile not updated' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 409 if email is already in use', async () => {
      mockContext.req.json.mockResolvedValue(validUpdatePayload)

      const uniqueError = new Error('Unique violation')
        ; (uniqueError as any).code = '23505'
      vi.mocked(updateUserProfile).mockRejectedValue(uniqueError)

      const result = await updateProfile(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'users.error.email_in_use', message: 'Email already in use' },
        409
      )
      expect(result.status).toBe(409)
    })

    it('should return 500 for schema validation failure or generic errors', async () => {
      mockContext.req.json.mockResolvedValue(validUpdatePayload)
      vi.mocked(updateUserProfile).mockRejectedValue(new Error('Generic database error'))

      const result = await updateProfile(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'users.error.update', message: 'Generic database error' },
        500
      )
      expect(result.status).toBe(500)
    })

    it('should return 500 if empty payload is provided due to schema validation', async () => {
      mockContext.req.json.mockResolvedValue({})

      const result = await updateProfile(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'users.error.update' }),
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('changePassword', () => {
    const validPasswordPayload = { oldPassword: 'oldPassword123', newPassword: 'newSecurePassword456' }

    it('should return 500 if oldPassword or newPassword is missing due to schema validation', async () => {
      mockContext.req.json.mockResolvedValue({ oldPassword: 'pass' })

      const result = await changePassword(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'users.error.change_password' }),
        500
      )
      expect(result.status).toBe(500)
    })

    it('should return 404 if user is not found', async () => {
      mockContext.req.json.mockResolvedValue(validPasswordPayload)
      vi.mocked(findUserById).mockResolvedValue(undefined as any)

      const result = await changePassword(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'users.error.not_found', message: 'User not found' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 401 if old password does not match', async () => {
      mockContext.req.json.mockResolvedValue(validPasswordPayload)
      vi.mocked(findUserById).mockResolvedValue(mockUser as any)
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      const result = await changePassword(mockContext)

      expect(bcrypt.compare).toHaveBeenCalledWith('oldPassword123', 'hashed-password')
      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'users.error.invalid_password', message: 'A senha atual está incorreta' },
        401
      )
      expect(result.status).toBe(401)
    })

    it('should return 422 if password is not updated in the database', async () => {
      mockContext.req.json.mockResolvedValue(validPasswordPayload)
      vi.mocked(findUserById).mockResolvedValue(mockUser as any)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hashed-password' as never)
      vi.mocked(updateUserPassword).mockResolvedValue(null as any)

      const result = await changePassword(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'users.error.update_password', message: 'Password not updated' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 200 when password is changed successfully', async () => {
      mockContext.req.json.mockResolvedValue(validPasswordPayload)
      vi.mocked(findUserById).mockResolvedValue(mockUser as any)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hashed-password' as never)
      vi.mocked(updateUserPassword).mockResolvedValue({ id: 'user-123' } as any)

      const result = await changePassword(mockContext)

      expect(bcrypt.hash).toHaveBeenCalledWith('newSecurePassword456', 10)
      expect(updateUserPassword).toHaveBeenCalledWith('user-123', 'new-hashed-password')
      expect(mockContext.json).toHaveBeenCalledWith(
        { message: 'Senha atualizada com sucesso' },
        200
      )
      expect(result.status).toBe(200)
    })

    it('should return 500 for generic errors during change password', async () => {
      mockContext.req.json.mockResolvedValue(validPasswordPayload)
      vi.mocked(findUserById).mockRejectedValue(new Error('Database connection failed'))

      const result = await changePassword(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'users.error.change_password', message: 'Database connection failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })
})
