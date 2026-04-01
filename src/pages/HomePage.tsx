import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
  const {
    data: health,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/api/v1/ping').then((res) => res.data),
  });

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <header className='border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          <h1 className='text-title-sm font-semibold text-gray-900 dark:text-white'>
            QSE - Qualité, Sécurité, Environnement
          </h1>
        </div>
      </header>
      <main>
        <div className='mx-auto max-w-7xl p-4 md:p-6'>
          <div className='card'>
            <h2 className='text-theme-xl font-semibold text-gray-800 dark:text-white mb-4'>
              Status du Backend
            </h2>
            {isLoading && (
              <div className='flex items-center gap-2 text-gray-500'>
                <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                <span>Chargement...</span>
              </div>
            )}
            {error && (
              <div className='badge badge-error'>
                Erreur de connexion au backend
              </div>
            )}
            {health && (
              <div className='space-y-4'>
                <div className='badge badge-success'>✓ Backend connecté</div>
                <pre className='rounded-lg bg-gray-100 p-4 text-theme-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300 overflow-auto'>
                  {JSON.stringify(health, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
