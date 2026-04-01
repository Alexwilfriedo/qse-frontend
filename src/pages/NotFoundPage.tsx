import { Link } from 'react-router-dom';

/**
 * Page 404 - Route non trouvée.
 */
export default function NotFoundPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4'>
      <div className='max-w-lg w-full text-center'>
        {/* 404 Illustration */}
        <div className='mb-8'>
          <div className='relative inline-block'>
            <span className='text-[150px] font-bold text-gray-200 dark:text-gray-800 leading-none'>
              404
            </span>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center'>
                <svg
                  className='w-12 h-12 text-brand-600 dark:text-brand-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-3'>
          Page introuvable
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mb-8 leading-relaxed'>
          La page que vous recherchez n'existe pas ou a été déplacée. Vérifiez
          l'URL ou retournez à l'accueil.
        </p>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <Link
            to='/'
            className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors'>
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors'>
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Page précédente
          </button>
        </div>

        {/* Help */}
        <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-800'>
          <p className='text-sm text-gray-500 dark:text-gray-500'>
            Besoin d'aide ?{' '}
            <a
              href='mailto:support@qse.com'
              className='text-brand-600 hover:text-brand-700 dark:text-brand-400'>
              Contactez le support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
