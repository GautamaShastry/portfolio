import { Link } from 'react-router-dom'
import { FaArrowLeft, FaCompass } from 'react-icons/fa6'
import SEO from '../components/SEO'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
    const { t } = useTranslation()

    return (
        <div className="min-h-[60vh] flex items-center justify-center py-20">
            <SEO title={t('notFound.title')} description={t('notFound.description')} path="/404" />
            <div className="text-center max-w-lg">
                <div className="inline-flex p-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-6">
                    <FaCompass size={36} aria-hidden="true" />
                </div>
                <p className="text-7xl font-black gradient-text">404</p>
                <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{t('notFound.title')}</h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400">{t('notFound.description')}</p>
                <Link to="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition-transform">
                    <FaArrowLeft size={14} aria-hidden="true" />
                    {t('notFound.home')}
                </Link>
            </div>
        </div>
    )
}

export default NotFound
