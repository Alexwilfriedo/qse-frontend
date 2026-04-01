import { useEffect, useState } from 'react';

/**
 * Écran affiché en cas d'interruption de connexion réseau.
 * Détecte automatiquement le retour en ligne.
 */
export function OfflineScreen() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const response = await fetch('/api/ping', { method: 'GET' });
      if (response.ok) {
        window.location.reload();
      }
    } catch {
      // Still offline
    } finally {
      setIsRetrying(false);
    }
  };

  if (isOnline) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-md w-full mx-4 text-center'>
        {/* Icon */}
        <div className='mx-auto w-24 h-24 mb-8 relative'>
          <div className='absolute inset-0 bg-brand-100 dark:bg-brand-900/30 rounded-full animate-pulse' />
          <div className='relative flex items-center justify-center w-full h-full'>
            <svg
              className='w-12 h-12 text-brand-600 dark:text-brand-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.5}>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z'
              />
              <line
                x1='4'
                y1='4'
                x2='20'
                y2='20'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
          Connexion interrompue
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mb-8 leading-relaxed'>
          Impossible de se connecter au serveur. Vérifiez votre connexion
          internet et réessayez.
        </p>

        {/* Actions */}
        <div className='space-y-4'>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className='w-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
            {isRetrying ? (
              <>
                <svg
                  className='animate-spin h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Vérification en cours...
              </>
            ) : (
              <>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  />
                </svg>
                Réessayer
              </>
            )}
          </button>

          <p className='text-sm text-gray-500 dark:text-gray-500'>
            La page se rechargera automatiquement dès que la connexion sera
            rétablie.
          </p>
        </div>

        {/* Status indicator */}
        <div className='mt-12 flex items-center justify-center gap-2 text-sm text-gray-500'>
          <span className='relative flex h-3 w-3'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75' />
            <span className='relative inline-flex rounded-full h-3 w-3 bg-red-500' />
          </span>
          Hors ligne
        </div>
      </div>
    </div>
  );
}
