// Google Analytics 4 with Consent Mode v2, without a cookie banner.
//
// - Analytics cookies are on by default, except for visitors in the EU/EEA, the UK and
//   Switzerland, where consent rules apply: there GA stays cookieless (anonymous pings that
//   Google uses for modelled visitor counts). Google applies these regional defaults itself.
// - Ad features are always off (ad_storage / ad_user_data / ad_personalization denied).
// - GA records the initial page load itself; App.jsx sends page views for in-app route changes.
// - Event parameters never contain personal details (no names, emails, or message text).
// - Without VITE_GA_MEASUREMENT_ID every function here is a no-op.
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// EU/EEA member states, plus the UK and Switzerland (ISO 3166-1 alpha-2)
const CONSENT_REQUIRED_REGIONS = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV',
    'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
]

let initialized = false

function gtag() {
    // gtag.js expects the arguments object itself, not an array
    window.dataLayer.push(arguments)
}

export function initAnalytics() {
    if (initialized || !MEASUREMENT_ID || typeof window === 'undefined') return
    initialized = true

    window.dataLayer = window.dataLayer || []
    const noAds = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }
    // Region-specific default first, then the default for everywhere else
    gtag('consent', 'default', { ...noAds, analytics_storage: 'denied', region: CONSENT_REQUIRED_REGIONS })
    gtag('consent', 'default', { ...noAds, analytics_storage: 'granted' })
    gtag('js', new Date())
    gtag('config', MEASUREMENT_ID, { send_page_view: false })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    document.head.appendChild(script)
}

export function trackPageView() {
    if (!initialized) return
    gtag('event', 'page_view', {
        page_location: window.location.href,
        page_title: document.title,
    })
}

// Named events for recruiter / engagement insights. Keep params free of personal data.
export function trackEvent(name, params = {}) {
    if (!initialized) return
    gtag('event', name, params)
}
