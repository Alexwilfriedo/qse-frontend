import { type ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Si true, conserve l'état des enfants entre ouvertures. Par défaut: false (réinitialise) */
  preserveState?: boolean;
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  preserveState = false,
}: ModalProps) {
  // Compteur pour forcer le remontage des enfants à chaque ouverture
  const openCountRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      openCountRef.current += 1;
    }
  }, [isOpen]);

  const panelRef = useRef<HTMLDivElement>(null);
  const clickedInsideRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-full items-center justify-center p-4'>
        <div
          className='fixed inset-0 bg-black/50 transition-opacity'
          onMouseDown={() => {
            requestAnimationFrame(() => {
              if (!clickedInsideRef.current) onCloseRef.current();
              clickedInsideRef.current = false;
            });
          }}
          aria-hidden='true'
        />
        <div
          ref={panelRef}
          className={`
            relative bg-white dark:bg-gray-800 
            rounded-lg shadow-xl 
            w-full ${sizeStyles[size]}
            transform transition-all
          `}
          onMouseDown={() => {
            clickedInsideRef.current = true;
          }}>
          {title && (
            <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                {title}
              </h3>
            </div>
          )}
          <div
            key={preserveState ? undefined : openCountRef.current}
            className='px-6 py-4 max-h-[calc(100vh-12rem)] overflow-y-auto'>
            {children}
          </div>
          {footer && (
            <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3'>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
