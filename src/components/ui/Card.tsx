import type { HTMLAttributes, ReactNode } from 'react';
import { SkeletonCard } from './Skeleton';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Card component with optional loading skeleton.
 */
export function Card({
  children,
  padding = 'md',
  isLoading = false,
  className = '',
  ...props
}: CardProps) {
  if (isLoading) {
    return <SkeletonCard className={className} />;
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-lg 
        border border-gray-200 dark:border-gray-700 
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
          {title}
        </h2>
        {description && (
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
