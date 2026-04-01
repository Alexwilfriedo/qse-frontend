import { Check, ChevronDown, Search, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type SelectHTMLAttributes,
} from 'react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'className' | 'onChange' | 'value'
> {
  options: SelectOption[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string | boolean;
  hint?: string;
  fullWidth?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Selectionner...',
  label,
  error,
  hint,
  fullWidth = true,
  searchable = false,
  clearable = false,
  disabled = false,
  required,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q),
    );
  }, [options, search]);

  // Compute drop direction on open
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const DROPDOWN_HEIGHT = 300;
    setDropUp(spaceBelow < DROPDOWN_HEIGHT && rect.top > DROPDOWN_HEIGHT);
  }, [isOpen]);

  const fireChange = useCallback(
    (newValue: string) => {
      if (!onChange) return;
      const syntheticEvent = {
        target: { value: newValue },
        currentTarget: { value: newValue },
      } as ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    },
    [onChange],
  );

  const selectOption = useCallback(
    (opt: SelectOption) => {
      fireChange(opt.value);
      setIsOpen(false);
      setSearch('');
      setHighlightIndex(-1);
    },
    [fireChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      fireChange('');
      setSearch('');
    },
    [fireChange],
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [isOpen, searchable]);

  // Scroll highlighted into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightIndex >= 0 && filtered[highlightIndex]) {
          selectOption(filtered[highlightIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        setHighlightIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightIndex((prev) =>
            prev < filtered.length - 1 ? prev + 1 : 0,
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1,
        );
        break;
    }
  };

  const hasError = !!error;
  const errorMsg = typeof error === 'string' ? error : undefined;

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full' : 'w-auto'}`}>
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
        id={inputId}
        type='button'
        role='combobox'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
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
            hasError
              ? 'border-error-500 focus:ring-2 focus:ring-error-500/20'
              : isOpen
                ? 'border-brand-500 ring-2 ring-brand-500/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'cursor-pointer'}
        `}>
        <span
          className={`truncate ${
            selectedOption
              ? 'text-gray-900 dark:text-white font-medium'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
          {selectedOption ? (
            <span className='flex items-center gap-2'>
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>

        <span className='flex items-center gap-1 ml-2 shrink-0'>
          {clearable && value && !disabled && (
            <span
              role='button'
              tabIndex={-1}
              onClick={handleClear}
              className='p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
              <X className='w-3.5 h-3.5 text-gray-400' />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute z-50 w-full
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            rounded-xl shadow-lg
            overflow-hidden
            animate-dropdown
            ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'}
          `}>
          {/* Search */}
          {searchable && (
            <div className='p-2 border-b border-gray-100 dark:border-gray-800'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  ref={searchRef}
                  type='text'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHighlightIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder='Rechercher...'
                  className='
                    w-full pl-8 pr-3 py-2 text-sm
                    bg-gray-50 dark:bg-gray-800
                    border-none rounded-lg
                    text-gray-900 dark:text-white
                    placeholder-gray-400
                    focus:outline-none focus:ring-1 focus:ring-brand-500/30
                  '
                />
              </div>
            </div>
          )}

          {/* Options */}
          <ul
            ref={listRef}
            role='listbox'
            className='max-h-60 overflow-y-auto py-1 no-scrollbar'>
            {filtered.length === 0 ? (
              <li className='px-3 py-3 text-sm text-gray-400 text-center'>
                Aucun resultat
              </li>
            ) : (
              filtered.map((opt, i) => {
                const isSelected = opt.value === value;
                const isHighlighted = i === highlightIndex;
                return (
                  <li
                    key={opt.value}
                    role='option'
                    aria-selected={isSelected}
                    onClick={() => selectOption(opt)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={`
                      flex items-center justify-between gap-2
                      px-3 py-2.5 text-sm cursor-pointer
                      transition-colors duration-100
                      ${isHighlighted ? 'bg-brand-50 dark:bg-brand-950/30' : ''}
                      ${
                        isSelected
                          ? 'text-brand-600 dark:text-brand-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }
                    `}>
                    <span className='flex items-center gap-2.5 min-w-0'>
                      {opt.icon && <span className='shrink-0'>{opt.icon}</span>}
                      <span className='truncate'>
                        {opt.label}
                        {opt.description && (
                          <span className='block text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-normal'>
                            {opt.description}
                          </span>
                        )}
                      </span>
                    </span>
                    {isSelected && (
                      <Check className='w-4 h-4 shrink-0 text-brand-500' />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Error / Hint */}
      {errorMsg && <p className='mt-1 text-xs text-red-500'>{errorMsg}</p>}
      {hint && !hasError && (
        <p className='mt-1 text-xs text-gray-500'>{hint}</p>
      )}
    </div>
  );
}
