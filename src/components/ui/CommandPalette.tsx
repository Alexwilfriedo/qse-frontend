import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
}

export function CommandPalette({
  items,
  placeholder = 'Rechercher...',
  emptyMessage = 'Aucun résultat',
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.toLowerCase().includes(query.toLowerCase())
  );

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const category = item.category || 'Général';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, CommandItem[]>
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].onSelect();
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleSelect = (item: CommandItem) => {
    item.onSelect();
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm'
        onClick={() => {
          setIsOpen(false);
          setQuery('');
        }}
      />

      {/* Dialog */}
      <div className='relative mx-auto mt-[15vh] max-w-xl'>
        <div className='overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700'>
          {/* Search Input */}
          <div className='flex items-center border-b border-gray-200 px-4 dark:border-gray-700'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
              />
            </svg>
            <input
              ref={inputRef}
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyNavigation}
              placeholder={placeholder}
              className='h-14 w-full border-0 bg-transparent px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-white'
            />
            <kbd className='hidden rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400 sm:block'>
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className='max-h-80 overflow-y-auto p-2'>
            {filteredItems.length === 0 ? (
              <div className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'>
                {emptyMessage}
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category}>
                  <div className='px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                    {category}
                  </div>
                  {categoryItems.map((item) => {
                    const globalIndex = filteredItems.indexOf(item);
                    const isSelected = globalIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                          isSelected
                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}>
                        {item.icon && (
                          <span className='flex-shrink-0'>{item.icon}</span>
                        )}
                        <div className='flex-1 truncate'>
                          <div className='font-medium'>{item.label}</div>
                          {item.description && (
                            <div className='truncate text-sm text-gray-500 dark:text-gray-400'>
                              {item.description}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className='flex items-center justify-between border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400'>
            <div className='flex gap-2'>
              <span>
                <kbd className='rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-700'>
                  ↑↓
                </kbd>{' '}
                naviguer
              </span>
              <span>
                <kbd className='rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-700'>
                  ↵
                </kbd>{' '}
                sélectionner
              </span>
            </div>
            <span>
              <kbd className='rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-700'>
                ⌘K
              </kbd>{' '}
              ouvrir
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}
