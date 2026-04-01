import { customToast } from '@/components/ui/Toast';
import toast, { ToastOptions } from 'react-hot-toast';

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
};

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastWithDescOptions {
  description?: string;
  actions?: ToastAction[];
}

export const showToast = {
  success: (message: string, options?: ToastWithDescOptions) =>
    customToast.success(message, options),

  error: (message: string, options?: ToastWithDescOptions) =>
    customToast.error(message, options),

  info: (message: string, options?: ToastWithDescOptions) =>
    customToast.info(message, options),

  warning: (message: string, options?: ToastWithDescOptions) =>
    customToast.warning(message, options),

  loading: (message: string, options?: ToastOptions) =>
    toast.loading(message, { ...defaultOptions, ...options }),

  dismiss: (toastId?: string) => toast.dismiss(toastId),

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions,
  ) =>
    toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      { ...defaultOptions, ...options },
    ),
};

export { toast };
