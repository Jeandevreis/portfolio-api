import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  getSettings,
  updateSettings
} from '../../controllers/settings.controller.js'

import {
  findGlobalSettings,
  updateGlobalSettingsRecord
} from '../../repositories/settings.repository.js'

vi.mock('../../repositories/settings.repository.js', () => ({
  findGlobalSettings: vi.fn(),
  updateGlobalSettingsRecord: vi.fn()
}))

describe('Settings Controller', () => {
  let mockContext: any

  const validPayload = {
    theme: 'dark',
    panelLanguage: 'en',
    siteUrl: 'https://site.com',
    publicEmail: 'contact@site.com',
    logoUrl: 'https://site.com/logo.png',
    customConfig: {
      key: 'value'
    }
  }

  beforeEach(() => {
    vi.resetAllMocks()

    mockContext = {
      req: {
        json: vi.fn()
      },
      json: vi.fn((data, status = 200) => ({ data, status }))
    }
  })

  describe('getSettings', () => {
    it('should return settings with status 200', async () => {
      const mockData = { id: '1', ...validPayload }
      vi.mocked(findGlobalSettings).mockResolvedValue(mockData as any)

      const result = await getSettings(mockContext)

      expect(findGlobalSettings).toHaveBeenCalled()
      expect(mockContext.json).toHaveBeenCalledWith(mockData, 200)
      expect(result.status).toBe(200)
    })

    it('should return 404 if settings are not found', async () => {
      vi.mocked(findGlobalSettings).mockResolvedValue(undefined as any)

      const result = await getSettings(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'settings.error.not_found', message: 'Settings not found' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 500 if an error occurs during retrieval', async () => {
      vi.mocked(findGlobalSettings).mockRejectedValue(new Error('Database error'))

      const result = await getSettings(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'settings.error.get', message: 'Database error' },
        500
      )
      expect(result.status).toBe(500)
    })
  })

  describe('updateSettings', () => {
    beforeEach(() => {
      vi.mocked(findGlobalSettings).mockResolvedValue({ id: '1' } as any)
    })

    it('should update settings and return 200 with the updated record', async () => {
      const mockUpdatedRecord = { id: '1', ...validPayload }

      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateGlobalSettingsRecord).mockResolvedValue(mockUpdatedRecord as any)

      const result = await updateSettings(mockContext)

      expect(updateGlobalSettingsRecord).toHaveBeenCalledWith('1', validPayload)
      expect(mockContext.json).toHaveBeenCalledWith(mockUpdatedRecord, 200)
      expect(result.status).toBe(200)
    })

    it('should return 404 if settings are not found during update', async () => {
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(findGlobalSettings).mockResolvedValue(undefined as any)

      const result = await updateSettings(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'settings.error.not_found', message: 'Settings not found' },
        404
      )
      expect(result.status).toBe(404)
    })

    it('should return 422 if the repository fails to update the record', async () => {
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateGlobalSettingsRecord).mockResolvedValue(null as any)

      const result = await updateSettings(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'settings.error.update', message: 'Settings not updated' },
        422
      )
      expect(result.status).toBe(422)
    })

    it('should return 500 if validation or update throws an error', async () => {
      mockContext.req.json.mockResolvedValue(validPayload)
      vi.mocked(updateGlobalSettingsRecord).mockRejectedValue(new Error('Update failed'))

      const result = await updateSettings(mockContext)

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'settings.error.update', message: 'Update failed' },
        500
      )
      expect(result.status).toBe(500)
    })
  })
})
