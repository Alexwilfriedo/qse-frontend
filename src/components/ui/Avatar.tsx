import type { ReactNode } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
  fallback?: ReactNode;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

/**
 * Avatar component with image or initials fallback.
 */
export function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  className = '',
  fallback,
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeStyles[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]} 
        rounded-full 
        bg-brand-100 dark:bg-brand-900 
        flex items-center justify-center
        ${className}
      `}>
      {fallback || (
        <span className='font-medium text-brand-700 dark:text-brand-300'>
          {initials}
        </span>
      )}
    </div>
  );
}
