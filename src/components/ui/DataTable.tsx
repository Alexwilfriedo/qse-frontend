import type { ReactNode } from 'react';
import { SkeletonTable } from './Skeleton';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | undefined;
  isLoading?: boolean;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  skeletonRows?: number;
}

/**
 * Generic data table with skeleton loading state.
 */
export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  keyExtractor,
  emptyMessage = 'Aucune donnée',
  skeletonRows = 5,
}: DataTableProps<T>) {
  if (isLoading) {
    return <SkeletonTable rows={skeletonRows} columns={columns.length} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className='card p-12 text-center'>
        <p className='text-gray-500 dark:text-gray-400'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className='card overflow-hidden'>
      <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
        <thead className='bg-gray-50 dark:bg-gray-800'>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.headerClassName || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
          {data.map((item) => (
            <tr key={keyExtractor(item)}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
