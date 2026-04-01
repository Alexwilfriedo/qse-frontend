import { Clock } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, '0'),
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0'),
);

export function TimePicker({
  value = '',
  onChange,
  label,
  error,
  hint,
  placeholder = 'Sélectionner',
  required = false,
  disabled = false,
  id,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const [selectedHour, selectedMinute] = value
    ? value.split(':')
    : ['', ''];

  const displayValue = value ? value.slice(0, 5) : '';

  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const DROPDOWN_HEIGHT = 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    const up = spaceBelow < DROPDOWN_HEIGHT && rect.top > DROPDOWN_HEIGHT;
    setPortalStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width < 160 ? 160 : rect.width,
      ...(up
        ? { bottom: window.innerHeight - rect.top + 6 }
        : { top: rect.bottom + 6 }),
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Scroll to selected values when opening
  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      scrollToSelected(hoursRef.current, selectedHour);
      scrollToSelected(minutesRef.current, selectedMinute);
    });
  }, [isOpen, selectedHour, selectedMinute]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        portalRef.current &&
        !portalRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((o) => !o);
    }
  };

  const selectHour = (h: string) => {
    const m = selectedMinute || '00';
    onChange?.(`${h}:${m}`);
  };

  const selectMinute = (m: string) => {
    const h = selectedHour || '00';
    onChange?.(`${h}:${m}`);
  };

  const setNow = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    onChange?.(`${h}:${m}`);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className='relative w-full'>
      {label && (
        <label
          htmlFor={inputId}
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      <button
        ref={triggerRef}
        type='button'
        id={inputId}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`
          group flex items-center justify-between w-full
          px-3 py-2.5 text-sm text-left
          bg-white dark:bg-gray-900
          border rounded-lg
          transition-all duration-200
          focus:outline-none
          ${
            error
              ? 'border-error-500 focus:ring-2 focus:ring-error-500/20'
              : isOpen
                ? 'border-brand-500 ring-2 ring-brand-500/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'cursor-pointer'}
        `}>
        <span className='flex items-center gap-2'>
          <Clock className='w-4 h-4 text-gray-400' />
          <span
            className={
              displayValue
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-gray-500'
            }>
            {displayValue || placeholder}
          </span>
        </span>
      </button>

      {/* Hidden input for form validation */}
      {required && (
        <input
          type='text'
          value={value}
          required
          tabIndex={-1}
          className='sr-only'
          onChange={() => {}}
        />
      )}

      {isOpen &&
        createPortal(
          <div
            ref={portalRef}
            style={portalStyle}
            className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg animate-dropdown'>
            {/* Hour & Minute columns */}
            <div className='flex divide-x divide-gray-200 dark:divide-gray-700'>
              <div className='flex-1'>
                <div className='px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                  Heure
                </div>
                <div
                  ref={hoursRef}
                  className='h-48 overflow-y-auto px-1.5 pb-1.5 scrollbar-thin'>
                  {HOURS.map((h) => (
                    <button
                      key={h}
                      type='button'
                      onClick={() => selectHour(h)}
                      className={`
                        w-full px-2 py-1.5 text-sm text-center rounded-lg
                        transition-all duration-150
                        ${
                          h === selectedHour
                            ? 'bg-brand-500 text-white font-semibold shadow-sm'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <div className='flex-1'>
                <div className='px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                  Minute
                </div>
                <div
                  ref={minutesRef}
                  className='h-48 overflow-y-auto px-1.5 pb-1.5 scrollbar-thin'>
                  {MINUTES.map((m) => (
                    <button
                      key={m}
                      type='button'
                      onClick={() => selectMinute(m)}
                      className={`
                        w-full px-2 py-1.5 text-sm text-center rounded-lg
                        transition-all duration-150
                        ${
                          m === selectedMinute
                            ? 'bg-brand-500 text-white font-semibold shadow-sm'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* "Now" shortcut */}
            <div className='border-t border-gray-200 dark:border-gray-700 px-4 py-2'>
              <button
                type='button'
                onClick={setNow}
                className='text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors'>
                Maintenant
              </button>
            </div>
          </div>,
          document.body,
        )}

      {error && typeof error === 'string' && (
        <p className='mt-1 text-xs text-red-500'>{error}</p>
      )}
      {hint && !error && <p className='mt-1 text-xs text-gray-500'>{hint}</p>}
    </div>
  );
}

function scrollToSelected(container: HTMLDivElement | null, value: string) {
  if (!container || !value) return;
  const buttons = container.querySelectorAll('button');
  for (const btn of buttons) {
    if (btn.textContent === value) {
      btn.scrollIntoView({ block: 'center' });
      break;
    }
  }
}
