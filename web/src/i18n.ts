// i18n configuration for RoastMe
const translations = {
    en: { appName: 'RoastMe', description: 'Upload a photo and get ruthlessly roasted by AI' },
    de: { appName: 'RoastMe', description: 'Upload a photo and get ruthlessly roasted by AI (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
