import { createMiddleware } from 'hono/factory'
import i18next from 'i18next'

import en from '../i18n/locales/en.json' with { type: 'json' }
import pt from '../i18n/locales/pt-BR.json' with { type: 'json' }
import es from '../i18n/locales/es.json' with { type: 'json' }

await i18next.init({
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es }
  }
})

export const i18nMiddleware = createMiddleware(async (c, next) => {
  const acceptLanguage = c.req.header('accept-language') || ''

  const match = acceptLanguage.match(/(pt|es|en)/i)
  const lng = match ? match[1].toLowerCase() : 'en'

  c.set('language', lng)

  c.set('t', (key: string, options = {}) =>
    i18next.t(key, {
      lng,
      ...options
    })
  )

  await next()
})
