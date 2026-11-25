import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import hi from './locales/hi.json'
import te from './locales/te.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import de from './locales/de.json'
import fr from './locales/fr.json'

const supportedLanguages = ['en', 'hi', 'te', 'zh', 'ja', 'de', 'fr']

const updateDocumentLanguage = (language) => {
    const locale = language?.split('-')[0] || 'en'
    document.documentElement.lang = locale
    document.documentElement.dir = ['ar', 'fa', 'he', 'ur'].includes(locale) ? 'rtl' : 'ltr'
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            te: { translation: te },
            zh: { translation: zh },
            ja: { translation: ja },
            de: { translation: de },
            fr: { translation: fr },
        },
        supportedLngs: supportedLanguages,
        nonExplicitSupportedLngs: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    })

updateDocumentLanguage(i18n.language)
i18n.on('languageChanged', updateDocumentLanguage)

export default i18n
