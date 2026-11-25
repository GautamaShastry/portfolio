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
import site from '../../site.config.js'

const supportedLanguages = ['en', 'hi', 'te', 'zh', 'ja', 'de', 'fr']

// Translations say {{name}} (and, in English, {{subject}} / {{possessive}} / {{object}}) instead
// of the owner's name and pronouns; fill those in from site.config.js for each language.
function withOwner(messages, lang) {
    const values = {
        name: site.localizedFirstName?.[lang] || site.firstName,
        subject: site.pronouns.subject,
        object: site.pronouns.object,
        possessive: site.pronouns.possessive,
    }
    const fill = (value) => {
        if (typeof value === 'string') return value.replace(/{{(name|subject|object|possessive)}}/g, (_, key) => values[key])
        if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fill(v)]))
        return value
    }
    return fill(messages)
}

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
            en: { translation: withOwner(en, 'en') },
            hi: { translation: withOwner(hi, 'hi') },
            te: { translation: withOwner(te, 'te') },
            zh: { translation: withOwner(zh, 'zh') },
            ja: { translation: withOwner(ja, 'ja') },
            de: { translation: withOwner(de, 'de') },
            fr: { translation: withOwner(fr, 'fr') },
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
