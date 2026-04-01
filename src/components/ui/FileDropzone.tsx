import { useCallback, useRef, useState, type DragEvent } from 'react';

interface FileDropzoneProps {
  label?: string;
  accept?: string;
  hint?: string;
  maxSizeMb?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
}

/**
 * Zone de drag & drop stylée pour l'import de fichiers.
 * Supporte le drag-over, le click-to-browse et l'affichage du fichier sélectionné.
 */
export function FileDropzone({
  label,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg',
  hint,
  maxSizeMb = 10,
  value,
  onChange,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      setError(null);
      if (!file) return;
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`Le fichier dépasse ${maxSizeMb} Mo.`);
        return;
      }
      onChange(file);
    },
    [maxSizeMb, onChange],
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragOver(false), []);

  const onBrowse = () => inputRef.current?.click();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = () => {
    setError(null);
    onChange(null);
  };

  return (
    <div className='w-full'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
          {label}
        </label>
      )}

      {value ? (
        <div className='flex items-center gap-3 rounded-lg border border-brand-200 dark:border-brand-800 bg-brand-25 dark:bg-brand-900/20 px-4 py-3'>
          <svg
            className='h-8 w-8 shrink-0 text-brand-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1.5}>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
            />
          </svg>
          <div className='min-w-0 flex-1'>
            <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
              {value.name}
            </p>
            <p className='text-xs text-gray-500'>
              {(value.size / 1024).toFixed(0)} Ko
            </p>
          </div>
          <button
            type='button'
            onClick={remove}
            className='shrink-0 rounded p-1 text-gray-400 hover:text-red-500 transition-colors'>
            <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      ) : (
        <div
          role='button'
          tabIndex={0}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={onBrowse}
          onKeyDown={(e) => e.key === 'Enter' && onBrowse()}
          className={`
            flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8
            cursor-pointer transition-colors
            ${
              isDragOver
                ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/30'
                : 'border-gray-300 bg-gray-50 hover:border-brand-300 hover:bg-brand-25 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-brand-700'
            }
          `}>
          <svg
            className={`h-10 w-10 ${isDragOver ? 'text-brand-500' : 'text-gray-400'}`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1.5}>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5'
            />
          </svg>
          <div className='text-center'>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              <span className='font-semibold text-brand-600 dark:text-brand-400'>
                Cliquez pour parcourir
              </span>{' '}
              ou glissez-déposez un fichier
            </p>
            <p className='mt-1 text-xs text-gray-400'>
              PDF, Word, Excel, PowerPoint, Image — max {maxSizeMb} Mo
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type='file'
        accept={accept}
        onChange={onInputChange}
        className='hidden'
      />

      {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
      {hint && !error && (
        <p className='mt-1 text-xs text-gray-500'>{hint}</p>
      )}
    </div>
  );
}
