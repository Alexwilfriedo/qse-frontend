import { SkeletonCard } from '@/components/ui';
import { BarChart3, CheckCircle, Target, XCircle } from 'lucide-react';
import type { KpiReportDashboardStats } from '../kpiReportTypes';

interface KpiReportDashboardCardsProps {
  stats: KpiReportDashboardStats | undefined;
  isLoading: boolean;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
  description?: string;
}

function StatCard({
  label,
  value,
  icon,
  bgClass,
  textClass,
  description,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${bgClass} transition-shadow hover:shadow-md`}>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
            {label}
          </p>
          <p className={`mt-2 text-3xl font-bold ${textClass}`}>{value}</p>
          {description && (
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              {description}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2 ${bgClass}`}>{icon}</div>
      </div>
    </div>
  );
}

export function KpiReportDashboardCards({
  stats,
  isLoading,
}: KpiReportDashboardCardsProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const rate = stats.effectivenessRate;
  const rateColor = rate >= 80 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400';
  const rateBg =
    rate >= 80
      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <StatCard
        label='Indicateurs à calculer'
        value={stats.totalIndicators}
        description='Total sur la période'
        icon={<BarChart3 className='w-5 h-5 text-amber-600' />}
        bgClass='bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
        textClass='text-amber-700 dark:text-amber-400'
      />
      <StatCard
        label='Cible atteinte'
        value={stats.targetReached}
        description='Résultat >= objectif'
        icon={<CheckCircle className='w-5 h-5 text-green-600' />}
        bgClass='bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
        textClass='text-green-700 dark:text-green-400'
      />
      <StatCard
        label='Cible non atteinte'
        value={stats.targetNotReached}
        description='Résultat < objectif'
        icon={<XCircle className='w-5 h-5 text-red-600' />}
        bgClass='bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
        textClass='text-red-700 dark:text-red-400'
      />
      <StatCard
        label="Taux d'efficacité"
        value={`${rate.toFixed(0)}%`}
        description={`${stats.targetReached}/${stats.totalIndicators} — Cible: >= 80%`}
        icon={<Target className='w-5 h-5 text-blue-600' />}
        bgClass={rateBg}
        textClass={rateColor}
      />
    </div>
  );
}
