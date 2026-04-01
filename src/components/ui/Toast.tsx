import toast, { Toast as HotToast } from 'react-hot-toast';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface CustomToastProps {
  t: HotToast;
  variant: ToastVariant;
  title: string;
  description?: string;
  actions?: ToastAction[];
}

const variantConfig: Record<
  ToastVariant,
  { icon: React.ReactNode; statusClass: string; borderClass: string }
> = {
  success: {
    icon: (
      <svg
        className='h-5 w-5 text-success-500'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 13l4 4L19 7'
        />
      </svg>
    ),
    statusClass: 'bg-success-100 dark:bg-success-900/30',
    borderClass: 'border-success-200 dark:border-success-800',
  },
  error: {
    icon: (
      <svg
        className='h-5 w-5 text-error-500'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M6 18L18 6M6 6l12 12'
        />
      </svg>
    ),
    statusClass: 'bg-error-100 dark:bg-error-900/30',
    borderClass: 'border-error-200 dark:border-error-800',
  },
  warning: {
    icon: (
      <svg
        className='h-5 w-5 text-warning-500'
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
    ),
    statusClass: 'bg-warning-100 dark:bg-warning-900/30',
    borderClass: 'border-warning-200 dark:border-warning-800',
  },
  info: {
    icon: (
      <svg
        className='h-5 w-5 text-info-500'
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
    ),
    statusClass: 'bg-info-100 dark:bg-info-900/30',
    borderClass: 'border-info-200 dark:border-info-800',
  },
};

function CustomToast({
  t,
  variant,
  title,
  description,
  actions,
}: CustomToastProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } pointer-events-auto flex w-full max-w-md overflow-hidden rounded-lg border bg-white shadow-lg dark:bg-gray-800 ${config.borderClass}`}>
      {/* Status icon */}
      <div
        className={`flex w-12 flex-shrink-0 items-center justify-center ${config.statusClass}`}>
        {config.icon}
      </div>

      {/* Content */}
      <div className='flex flex-1 items-start gap-3 p-4'>
        {/* App icon */}
        <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-brand-500'>
          <span className='text-xs font-bold text-white'>Q</span>
        </div>

        <div className='flex-1'>
          {/* Title */}
          <p className='text-sm font-semibold text-gray-900 dark:text-white'>
            {title}
          </p>

          {/* Description */}
          {description && (
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {description}
            </p>
          )}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className='mt-3 flex gap-3'>
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    toast.dismiss(t.id);
                  }}
                  className='text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300'>
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className='flex-shrink-0 p-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300'>
        <svg
          className='h-4 w-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
    </div>
  );
}

export const customToast = {
  success: (
    title: string,
    options?: { description?: string; actions?: ToastAction[] },
  ) =>
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          variant='success'
          title={title}
          description={options?.description}
          actions={options?.actions}
        />
      ),
      { duration: 4000 },
    ),

  error: (
    title: string,
    options?: { description?: string; actions?: ToastAction[] },
  ) =>
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          variant='error'
          title={title}
          description={options?.description}
          actions={options?.actions}
        />
      ),
      { duration: 6000 },
    ),

  warning: (
    title: string,
    options?: { description?: string; actions?: ToastAction[] },
  ) =>
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          variant='warning'
          title={title}
          description={options?.description}
          actions={options?.actions}
        />
      ),
      { duration: 5000 },
    ),

  info: (
    title: string,
    options?: { description?: string; actions?: ToastAction[] },
  ) =>
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          variant='info'
          title={title}
          description={options?.description}
          actions={options?.actions}
        />
      ),
      { duration: 4000 },
    ),

  dismiss: (toastId?: string) => toast.dismiss(toastId),
};

export { CustomToast };
