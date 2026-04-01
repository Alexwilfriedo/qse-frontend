import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Permission } from '../adminApi';

interface PermissionSelectorProps {
  permissions: Permission[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  disabled?: boolean;
}

export function PermissionSelector({
  permissions,
  selected,
  onChange,
  disabled = false,
}: PermissionSelectorProps) {
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    for (const p of permissions) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    }
    return map;
  }, [permissions]);

  const filteredGrouped = useMemo(() => {
    if (!search) return grouped;
    const q = search.toLowerCase();
    const result: Record<string, Permission[]> = {};
    for (const [cat, perms] of Object.entries(grouped)) {
      const filtered = perms.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          cat.toLowerCase().includes(q),
      );
      if (filtered.length > 0) result[cat] = filtered;
    }
    return result;
  }, [grouped, search]);

  const filteredCategories = useMemo(
    () => Object.keys(filteredGrouped).sort(),
    [filteredGrouped],
  );

  const togglePermission = (permId: string) => {
    const next = new Set(selected);
    if (next.has(permId)) {
      next.delete(permId);
    } else {
      next.add(permId);
    }
    onChange(next);
  };

  const toggleCategory = (categoryPerms: Permission[]) => {
    const allSelected = categoryPerms.every((p) => selected.has(p.id));
    const next = new Set(selected);
    for (const p of categoryPerms) {
      if (allSelected) {
        next.delete(p.id);
      } else {
        next.add(p.id);
      }
    }
    onChange(next);
  };

  const selectAll = () => {
    onChange(new Set(permissions.map((p) => p.id)));
  };

  const clearAll = () => {
    onChange(new Set());
  };

  const totalCount = permissions.length;

  return (
    <div className='space-y-4'>
      {/* Header: search + counters */}
      <div className='flex items-center gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Rechercher une permission...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent'
          />
        </div>
        <div className='flex items-center gap-2 shrink-0'>
          <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
            <span className='text-brand-600 dark:text-brand-400 font-semibold'>
              {selected.size}
            </span>
            {' / '}
            {totalCount}
          </span>
          <button
            type='button'
            onClick={selectAll}
            disabled={disabled}
            className='text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium disabled:opacity-50'>
            Tout
          </button>
          <span className='text-gray-300 dark:text-gray-600'>|</span>
          <button
            type='button'
            onClick={clearAll}
            disabled={disabled}
            className='text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium disabled:opacity-50'>
            Aucun
          </button>
        </div>
      </div>

      {/* Categories grid */}
      <div className='space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto no-scrollbar'>
        {filteredCategories.length === 0 && (
          <div className='text-center py-8 text-sm text-gray-400'>
            Aucune permission trouvée
          </div>
        )}
        {filteredCategories.map((category) => {
          const perms = filteredGrouped[category];
          const fullCategoryPerms = grouped[category] ?? [];
          const allSelected = fullCategoryPerms.every((p) =>
            selected.has(p.id),
          );
          const someSelected =
            !allSelected && fullCategoryPerms.some((p) => selected.has(p.id));
          const selectedInCategory = fullCategoryPerms.filter((p) =>
            selected.has(p.id),
          ).length;

          return (
            <div
              key={category}
              className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden'>
              {/* Category header */}
              <div className='flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={allSelected}
                    disabled={disabled}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={() => toggleCategory(fullCategoryPerms)}
                    className='h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500'
                  />
                  <span className='text-sm font-semibold text-gray-900 dark:text-white capitalize'>
                    {category}
                  </span>
                </label>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  {selectedInCategory} / {fullCategoryPerms.length}
                </span>
              </div>

              {/* Permission checkboxes */}
              <div className='grid grid-cols-2 gap-x-6 gap-y-2 p-4'>
                {perms.map((perm) => (
                  <label
                    key={perm.id}
                    className='flex items-start gap-2.5 cursor-pointer group'>
                    <input
                      type='checkbox'
                      checked={selected.has(perm.id)}
                      disabled={disabled}
                      onChange={() => togglePermission(perm.id)}
                      className='mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500'
                    />
                    <div className='min-w-0'>
                      <span className='text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'>
                        {perm.name}
                      </span>
                      {perm.description && (
                        <span className='block text-xs text-gray-400 dark:text-gray-500 truncate'>
                          {perm.description}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
