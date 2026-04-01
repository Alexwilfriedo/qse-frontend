import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function SidePanel({
  isOpen,
  onClose,
  title,
  children,
  width = 'md',
}: SidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 overflow-hidden'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 transition-opacity'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Panel */}
      <div className='fixed inset-y-0 right-0 flex max-w-full'>
        <div
          ref={panelRef}
          className={`w-screen ${widthClasses[width]} transform transition-transform duration-300 ease-in-out`}
          tabIndex={-1}
          role='dialog'
          aria-modal='true'
          aria-labelledby='sidepanel-title'>
          <div className='flex h-full flex-col bg-white shadow-xl dark:bg-gray-800'>
            {/* Header */}
            <div className='flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6'>
              <h2
                id='sidepanel-title'
                className='text-lg font-semibold text-gray-900 dark:text-white'>
                {title}
              </h2>
              <button
                type='button'
                onClick={onClose}
                className='rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:hover:bg-gray-700 dark:hover:text-gray-300'>
                <span className='sr-only'>Fermer</span>
                <svg
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
