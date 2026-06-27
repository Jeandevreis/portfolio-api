import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

import contactRoutes from '../../routes/contact.routes.js'
import { sendContactEmail } from '../../controllers/contact.controller.js'

vi.mock('../../controllers/contact.controller.js', () => ({
  sendContactEmail: vi.fn((c) => c.json({ success: true, message: 'Email sent successfully' }, 200))
}))

describe('Contact Routes', () => {
  let app: Hono

  beforeEach(() => {
    vi.clearAllMocks()
    app = new Hono()
    app.route('/api/contact', contactRoutes)
  })

  describe('Public Routes', () => {
    it('should process the contact form submission on POST /api/contact with valid payload', async () => {
      const res = await app.request('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          company: 'Acme Corp',
          email: 'john@example.com',
          message: 'Hello there, this is a valid message'
        })
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual({ success: true, message: 'Email sent successfully' })
      expect(sendContactEmail).toHaveBeenCalled()
    })

    it('should return 400 on POST /api/contact with invalid payload due to schema validation', async () => {
      const res = await app.request('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jo',
          email: 'not-an-email'
        })
      })

      expect(res.status).toBe(400)
      expect(sendContactEmail).not.toHaveBeenCalled()
    })
  })
})
