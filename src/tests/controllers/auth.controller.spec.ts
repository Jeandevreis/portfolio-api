import { describe, it, expect, vi, beforeEach } from 'vitest'

import { sign } from 'hono/jwt'
import { setCookie, deleteCookie } from 'hono/cookie'

import * as bcrypt from 'bcryptjs'

import { login, logout } from '../../controllers/auth.controller.js'

import {
  findUserByEmail,
  updateLoginAttempts,
  resetLoginAttempts
} from '../../repositories/users.repository.js'

vi.mock('../../repositories/users.repository.js', () => ({
  findUserByEmail: vi.fn(),
  updateLoginAttempts: vi.fn(),
  resetLoginAttempts: vi.fn()
}))

vi.mock('bcryptjs', () => ({
  compare: vi.fn()
}))

vi.mock('hono/jwt', () => ({
  sign: vi.fn()
}))

vi.mock('hono/cookie', () => ({
  setCookie: vi.fn(),
  deleteCookie: vi.fn()
}))

describe('Auth Controller', () => {
  let mockContext: any

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret'
    process.env.NODE_ENV = 'development'

    mockContext = {
      req: {
        json: vi.fn()
      },
      json: vi.fn((data, status = 200) => ({ data, status }))
    }
  })

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      mockContext.req.json.mockResolvedValue({ email: 'test@test.com' })

      const result = await login(mockContext)

      expect(result.status).toBe(400)
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Email and password required' }, 400)
    })

    it('should return 401 if user is not found', async () => {
      mockContext.req.json.mockResolvedValue({ email: 'test@test.com', password: 'password' })
      vi.mocked(findUserByEmail).mockResolvedValue(undefined as any)

      const result = await login(mockContext)

      expect(result.status).toBe(401)
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Invalid credentials' }, 401)
    })

    it('should return 429 if account is locked', async () => {
      mockContext.req.json.mockResolvedValue({ email: 'test@test.com', password: 'password' })

      const futureDate = new Date()
      futureDate.setHours(futureDate.getHours() + 1)

      vi.mocked(findUserByEmail).mockResolvedValue({
        id: 'user-123',
        email: 'test@test.com',
        lockUntil: futureDate
      } as any)

      const result = await login(mockContext)

      expect(result.status).toBe(429)
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Account temporarily locked' }, 429)
    })

    it('should return 401 and update attempts if password is wrong', async () => {
      mockContext.req.json.mockResolvedValue({ email: 'test@test.com', password: 'wrong' })
      vi.mocked(findUserByEmail).mockResolvedValue({
        id: 'user-123',
        email: 'test@test.com',
        passwordHash: 'hash',
        loginAttempts: 2,
        lockUntil: null
      } as any)
      vi.mocked(bcrypt.compare).mockResolvedValue(false as any)

      const result = await login(mockContext)

      expect(result.status).toBe(401)
      expect(updateLoginAttempts).toHaveBeenCalledWith('user-123', 3, null)
    })

    it('should login, reset attempts and set cookie on success', async () => {
      mockContext.req.json.mockResolvedValue({ email: 'test@test.com', password: 'correct' })
      vi.mocked(findUserByEmail).mockResolvedValue({
        id: 'user-123',
        email: 'test@test.com',
        passwordHash: 'hash',
        loginAttempts: 2,
        lockUntil: null
      } as any)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any)
      vi.mocked(sign).mockResolvedValue('fake-jwt-token')

      const result = await login(mockContext)

      expect(resetLoginAttempts).toHaveBeenCalledWith('user-123')
      expect(setCookie).toHaveBeenCalledWith(mockContext, 'auth_token', 'fake-jwt-token', expect.any(Object))
      expect(result.status).toBe(200)
    })
  })

  describe('logout', () => {
    it('should delete cookie and return success message', async () => {
      const result = await logout(mockContext)

      expect(deleteCookie).toHaveBeenCalledWith(mockContext, 'auth_token', expect.any(Object))
      expect(result.status).toBe(200)
    })
  })
})
