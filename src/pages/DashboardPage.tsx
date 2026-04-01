import { Card, CardHeader, PageHeader, SkeletonCard } from '@/components/ui';
import KpiCard from '@/features/kpi/components/KpiCard';
import { useDashboard } from '@/features/kpi/hooks/useKpiQueries';
import { BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { data: indicators, isLoading } = useDashboard();

  const stats = indicators
    ? {
        total: indicators.length,
        vert: indicators.filter((i) => i.couleurSeuil === 'VERT').length,
        orange: indicators.filter((i) => i.couleurSeuil === 'ORANGE').length,
        rouge: indicators.filter((i) => i.couleurSeuil === 'ROUGE').length,
        sansMesure: indicators.filter((i) => i.derniereValeur == null).length,
      }
    : null;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Tableau de bord'
        description='Vue consolidée des indicateurs de pilotage'
      />

      {isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {stats && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <SummaryCard
            label='Total indicateurs'
            value={stats.total}
            color='text-gray-900 dark:text-gray-100'
          />
          <SummaryCard
            label='Conformes'
            value={stats.vert}
            color='text-green-600'
          />
          <SummaryCard
            label='Attention'
            value={stats.orange}
            color='text-orange-600'
          />
          <SummaryCard
            label='Critiques'
            value={stats.rouge}
            color='text-red-600'
          />
        </div>
      )}

      {/* ========== Indicateurs KPI ========== */}
      <Card>
        <CardHeader
          title='Indicateurs de pilotage'
          description='Dernière valeur, seuil et tendance pour chaque indicateur actif'
        />

        {!isLoading && indicators && indicators.length === 0 && (
          <div className='p-12 text-center'>
            <BarChart3 className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-white'>
              Aucun indicateur
            </h3>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Créez des indicateurs depuis la page de détail d&apos;un
              processus.
            </p>
          </div>
        )}

        {indicators && indicators.length > 0 && (
          <div className='p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {indicators.map((ind) => (
              <KpiCard key={ind.indicatorId} indicator={ind} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className='rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4'>
      <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
        {label}
      </p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
