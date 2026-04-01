import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = '', error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={textareaId}
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            {label}
            {props.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-3 py-2 
            border rounded-lg
            text-gray-900 dark:text-white
            bg-white dark:bg-gray-800
            border-gray-300 dark:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
            placeholder-gray-400 dark:placeholder-gray-500
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y min-h-[80px]
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
        {hint && !error && <p className='mt-1 text-xs text-gray-500'>{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
