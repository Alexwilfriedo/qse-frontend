import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary pour capturer les erreurs React/TypeScript.
 * Affiche un écran de debug pratique avec stack trace en développement.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleCopyError = () => {
    const { error, errorInfo } = this.state;
    const errorText = `Error: ${error?.message}\n\nStack: ${error?.stack}\n\nComponent Stack: ${errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorText);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;
      const isDev = import.meta.env.DEV;

      return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4'>
          <div className='max-w-4xl w-full'>
            {/* Header */}
            <div className='bg-white dark:bg-gray-800 rounded-t-xl border border-gray-200 dark:border-gray-700 p-6'>
              <div className='flex items-start gap-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-red-600 dark:text-red-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
                    Une erreur s'est produite
                  </h1>
                  <p className='mt-1 text-gray-600 dark:text-gray-400'>
                    {isDev
                      ? "L'application a rencontré une erreur inattendue."
                      : "Nous nous excusons pour ce désagrément. L'équipe technique a été notifiée."}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Details (Dev Mode) */}
            {isDev && error && (
              <div className='bg-gray-900 border-x border-gray-200 dark:border-gray-700'>
                {/* Error Message */}
                <div className='p-4 border-b border-gray-700'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='px-2 py-0.5 bg-red-500 text-white text-xs font-mono rounded'>
                      {error.name}
                    </span>
                    <span className='text-gray-400 text-xs'>
                      Environnement: Development
                    </span>
                  </div>
                  <p className='text-red-400 font-mono text-sm break-all'>
                    {error.message}
                  </p>
                </div>

                {/* Stack Trace */}
                <div className='p-4 max-h-64 overflow-auto'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-gray-400 text-xs font-medium uppercase tracking-wide'>
                      Stack Trace
                    </span>
                    <button
                      onClick={this.handleCopyError}
                      className='text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                        />
                      </svg>
                      Copier
                    </button>
                  </div>
                  <pre className='text-gray-300 font-mono text-xs whitespace-pre-wrap leading-relaxed'>
                    {error.stack}
                  </pre>
                </div>

                {/* Component Stack */}
                {errorInfo?.componentStack && (
                  <div className='p-4 border-t border-gray-700 max-h-48 overflow-auto'>
                    <span className='text-gray-400 text-xs font-medium uppercase tracking-wide block mb-2'>
                      Component Stack
                    </span>
                    <pre className='text-blue-400 font-mono text-xs whitespace-pre-wrap leading-relaxed'>
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className='bg-white dark:bg-gray-800 rounded-b-xl border border-t-0 border-gray-200 dark:border-gray-700 p-6'>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={this.handleReload}
                  className='flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2'>
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
                  Recharger la page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className='flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-2'>
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
                </button>
              </div>

              {isDev && (
                <div className='mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
                  <div className='flex gap-2'>
                    <svg
                      className='w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <div className='text-sm text-yellow-800 dark:text-yellow-200'>
                      <strong>Conseil:</strong> Vérifiez la console du
                      navigateur pour plus de détails. En production, cet écran
                      sera simplifié.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
