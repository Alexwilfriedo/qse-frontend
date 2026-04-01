import type { ReactNode } from 'react';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'brand';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  warning:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  brand: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
};

export function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  // Si className contient des classes de couleur, ne pas appliquer le variant
  const hasCustomColors = className.includes('bg-') || className.includes('text-');

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 
        rounded-full text-xs font-medium
        ${hasCustomColors ? '' : variantStyles[variant]}
        ${className}
      `}>
      {children}
    </span>
  );
}
