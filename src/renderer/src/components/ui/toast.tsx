import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: cn(
            'rounded-lg border bg-surface-raised shadow-lg',
            'p-4 flex items-start gap-3',
            'data-[type=success]:border-success-600',
            'data-[type=error]:border-error-600',
            'data-[type=warning]:border-warning-600',
            'data-[type=info]:border-primary-600'
          ),
          title: 'text-base font-medium text-text-primary',
          description: 'text-sm text-text-secondary mt-1',
          actionButton: cn(
            'bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm font-medium',
            'hover:bg-primary-700 transition-colors'
          ),
          cancelButton: cn(
            'bg-background-tertiary text-text-primary px-3 py-1.5 rounded-md text-sm font-medium',
            'hover:bg-border-medium transition-colors'
          ),
          closeButton: cn(
            'absolute top-2 right-2 rounded-md p-1',
            'text-text-tertiary hover:text-text-primary hover:bg-background-secondary',
            'transition-colors'
          ),
          success: 'text-success-600',
          error: 'text-error-600',
          warning: 'text-warning-600',
          info: 'text-primary-600',
        },
      }}
    />
  );
}

// Custom toast icons
const ToastIcon = {
  success: <CheckCircle2 className="h-5 w-5 text-success-600 flex-shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-error-600 flex-shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning-600 flex-shrink-0" />,
  info: <Info className="h-5 w-5 text-primary-600 flex-shrink-0" />,
};

// Enhanced toast functions
export const toast = {
  success: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast.success(message, {
      icon: ToastIcon.success,
      ...options,
    });
  },

  error: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast.error(message, {
      icon: ToastIcon.error,
      duration: 5000, // Error messages display longer
      ...options,
    });
  },

  warning: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast.warning(message, {
      icon: ToastIcon.warning,
      ...options,
    });
  },

  info: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast.info(message, {
      icon: ToastIcon.info,
      ...options,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  // Toast with action button
  withAction: (
    message: string,
    {
      type = 'info',
      action,
      description,
    }: {
      type?: 'success' | 'error' | 'warning' | 'info';
      description?: string;
      action: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const toastFn =
      type === 'success'
        ? sonnerToast.success
        : type === 'error'
          ? sonnerToast.error
          : type === 'warning'
            ? sonnerToast.warning
            : sonnerToast;

    return toastFn(message, {
      icon: ToastIcon[type],
      description,
      action: {
        label: action.label,
        onClick: action.onClick,
      },
    });
  },

  // Manual dismiss
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },
};

// Re-export original toast for backward compatibility
export { sonnerToast };
