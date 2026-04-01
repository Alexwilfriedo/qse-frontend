import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const DAYS_SHORT = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  min?: string;
  max?: string;
  id?: string;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-first
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDate(str: string): Date | null {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return isNaN(d.getTime()) ? null : d;
}

function formatDisplay(str: string): string {
  const d = parseDate(str);
  if (!d) return '';
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function DatePicker({
  value = '',
  onChange,
  label,
  error,
  hint,
  placeholder = 'Sélectionner une date',
  required = false,
  disabled = false,
  clearable = false,
  min,
  max,
  id,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const parsed = parseDate(value);
  const [viewYear, setViewYear] = useState(
    parsed?.getFullYear() ?? new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    parsed?.getMonth() ?? new Date().getMonth(),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  // Sync view when value changes externally
  useEffect(() => {
    const d = parseDate(value);
    if (d) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});

  // Compute position on open (and on scroll/resize)
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const CALENDAR_HEIGHT = 360;
    const spaceBelow = window.innerHeight - rect.bottom;
    const up = spaceBelow < CALENDAR_HEIGHT && rect.top > CALENDAR_HEIGHT;
    setPortalStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width < 288 ? 288 : rect.width,
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

  // Close on outside click (checks both trigger container and portal)
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

  const minDate = useMemo(() => parseDate(min ?? ''), [min]);
  const maxDate = useMemo(() => parseDate(max ?? ''), [max]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [minDate, maxDate],
  );

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDate = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (isDateDisabled(date)) return;
    onChange?.(formatDate(date));
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((o) => !o);
    }
  };

  const isToday = (day: number) => {
    const now = new Date();
    return (
      day === now.getDate() &&
      viewMonth === now.getMonth() &&
      viewYear === now.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!parsed) return false;
    return (
      day === parsed.getDate() &&
      viewMonth === parsed.getMonth() &&
      viewYear === parsed.getFullYear()
    );
  };

  // Build calendar grid
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

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

      {/* Trigger */}
      <button
        ref={triggerRef}
        type='button'
        id={inputId}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`
          group flex items-center justify-between w-full
          px-3 py-2 text-sm text-left
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
          <Calendar className='w-4 h-4 text-gray-400' />
          <span
            className={
              value
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-gray-500'
            }>
            {value ? formatDisplay(value) : placeholder}
          </span>
        </span>
        <span className='flex items-center gap-1'>
          {clearable && value && !disabled && (
            <span
              role='button'
              tabIndex={-1}
              onClick={handleClear}
              className='p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
              <X className='w-3.5 h-3.5 text-gray-400' />
            </span>
          )}
        </span>
      </button>

      {/* Calendar dropdown (portal) */}
      {isOpen &&
        createPortal(
          <div
            ref={portalRef}
            style={portalStyle}
            className={`w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg animate-dropdown`}>
            {/* Month/Year navigation */}
            <div className='flex items-center justify-between px-4 pt-4 pb-2'>
              <button
                type='button'
                onClick={prevMonth}
                className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                <ChevronLeft className='w-4 h-4 text-gray-600 dark:text-gray-300' />
              </button>
              <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type='button'
                onClick={nextMonth}
                className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                <ChevronRight className='w-4 h-4 text-gray-600 dark:text-gray-300' />
              </button>
            </div>

            {/* Day headers */}
            <div className='grid grid-cols-7 px-3 pb-1'>
              {DAYS_SHORT.map((d) => (
                <div
                  key={d}
                  className='text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1'>
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className='grid grid-cols-7 px-3 pb-3'>
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} />;
                }
                const date = new Date(viewYear, viewMonth, day);
                const isDisabled = isDateDisabled(date);
                const selected = isSelected(day);
                const today = isToday(day);

                return (
                  <button
                    key={day}
                    type='button'
                    disabled={isDisabled}
                    onClick={() => selectDate(day)}
                    className={`
                    relative w-9 h-9 mx-auto flex items-center justify-center
                    text-sm rounded-lg transition-all duration-150
                    ${isDisabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'cursor-pointer'}
                    ${
                      selected
                        ? 'bg-brand-500 text-white font-semibold shadow-sm'
                        : today
                          ? 'text-brand-600 dark:text-brand-400 font-semibold ring-1 ring-brand-300 dark:ring-brand-600'
                          : !isDisabled
                            ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            : ''
                    }
                  `}>
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Today shortcut */}
            <div className='border-t border-gray-200 dark:border-gray-700 px-4 py-2'>
              <button
                type='button'
                onClick={() => {
                  const now = new Date();
                  onChange?.(formatDate(now));
                  setIsOpen(false);
                }}
                className='text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors'>
                Aujourd'hui
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
