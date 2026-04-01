import { SkeletonCard } from '@/components/ui';
import { SST_EVENT_TYPES } from '../sstTypes';
import type { SstMonthlyReport } from '../sstTypes';

interface SstAccidentCardsProps {
  report: SstMonthlyReport | undefined;
  isLoading: boolean;
}

export function SstAccidentCards({ report, isLoading }: SstAccidentCardsProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
      {SST_EVENT_TYPES.map((evt) => {
        const value = report[evt.key as keyof SstMonthlyReport] as number;
        const isOverTarget = value > evt.target;

        return (
          <div
            key={evt.key}
            className={`
              rounded-xl border-2 p-4 transition-shadow hover:shadow-md
              bg-white dark:bg-gray-800
              ${
                isOverTarget
                  ? 'border-red-400 dark:border-red-600'
                  : 'border-green-400 dark:border-green-600'
              }
            `}>
            <p className='text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight'>
              {evt.label}
            </p>
            <p
              className={`mt-2 text-3xl font-bold ${
                isOverTarget
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
              {value}
            </p>
            <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
              Cible : {evt.targetLabel}
            </p>
          </div>
        );
      })}
    </div>
  );
}
