import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton/Shimmer component for loading states.
 * Use this as a placeholder while content is loading.
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const defaultHeight = variant === 'text' ? '1em' : height;

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${variantStyles[variant]}
        ${animationStyles[animation]}
        ${className}
      `}
      style={{
        width: width,
        height: defaultHeight,
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * Skeleton for text lines.
 */
export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant='text'
          width={i === lines - 1 ? '60%' : '100%'}
          height='0.875rem'
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for avatar.
 */
export function SkeletonAvatar({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return <Skeleton variant='circular' className={sizes[size]} />;
}

/**
 * Skeleton for a card.
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className='flex items-center gap-4 mb-4'>
        <SkeletonAvatar size='lg' />
        <div className='flex-1'>
          <Skeleton variant='text' width='40%' height='1.25rem' className='mb-2' />
          <Skeleton variant='text' width='60%' height='0.875rem' />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

/**
 * Skeleton for table row.
 */
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className='animate-pulse'>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className='px-6 py-4'>
          {i === 0 ? (
            <div className='flex items-center gap-3'>
              <SkeletonAvatar size='md' />
              <div className='flex-1'>
                <Skeleton variant='text' width='70%' height='0.875rem' className='mb-1' />
                <Skeleton variant='text' width='50%' height='0.75rem' />
              </div>
            </div>
          ) : (
            <Skeleton variant='text' width='80%' height='0.875rem' />
          )}
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton for a table.
 */
export function SkeletonTable({
  rows = 5,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className='card overflow-hidden'>
      <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
        <thead className='bg-gray-50 dark:bg-gray-800'>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className='px-6 py-3'>
                <Skeleton variant='text' width='60%' height='0.75rem' />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
