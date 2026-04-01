import { Card, SkeletonCard } from '@/components/ui';
import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useActionDashboard } from '../hooks/useActionDashboard';
import { ActionStatsCard } from './ActionStatsCard';

const DOMAINE_COLORS: Record<string, string> = {
  QUALITE: 'bg-blue-500',
  SECURITE: 'bg-orange-500',
  ENVIRONNEMENT: 'bg-green-500',
};

const TYPE_COLORS: Record<string, string> = {
  CORRECTIVE: 'bg-red-500',
  PREVENTIVE: 'bg-yellow-500',
  CURATIVE: 'bg-purple-500',
  AMELIORATION: 'bg-emerald-500',
};

export function ActionDashboard() {
  const { data, isLoading, isError } = useActionDashboard();

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className='p-6 text-center text-red-600'>
        Erreur lors du chargement du dashboard
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
        <ActionStatsCard
          title='Total Actions'
          value={data.actionsTotal}
          icon={<ClipboardList className='h-6 w-6' />}
          color='blue'
        />
        <ActionStatsCard
          title='Ouvertes'
          value={data.actionsOuvertes}
          icon={<Clock className='h-6 w-6' />}
          color='yellow'
        />
        <ActionStatsCard
          title='En cours'
          value={data.actionsEnCours}
          icon={<TrendingUp className='h-6 w-6' />}
          color='blue'
        />
        <ActionStatsCard
          title='En retard'
          value={data.actionsEnRetard}
          icon={<AlertTriangle className='h-6 w-6' />}
          color='red'
        />
        <ActionStatsCard
          title='Terminées'
          value={data.actionsTerminees}
          icon={<CheckCircle className='h-6 w-6' />}
          color='green'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='p-6'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            Répartition par domaine
          </h3>
          <div className='space-y-3'>
            {Object.entries(data.parDomaine).map(([domaine, count]) => (
              <div key={domaine} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-3 h-3 rounded-full ${DOMAINE_COLORS[domaine] ?? 'bg-gray-400'}`}
                  />
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    {domaine}
                  </span>
                </div>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            Répartition par type
          </h3>
          <div className='space-y-3'>
            {Object.entries(data.parType).map(([type, count]) => (
              <div key={type} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-3 h-3 rounded-full ${TYPE_COLORS[type] ?? 'bg-gray-400'}`}
                  />
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    {type}
                  </span>
                </div>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className='p-6'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
            Taux de réalisation
          </h3>
          <span className='text-2xl font-bold text-green-600'>
            {data.tauxRealisation}%
          </span>
        </div>
        <div className='mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
          <div
            className='bg-green-500 h-3 rounded-full transition-all duration-500'
            style={{ width: `${Math.min(data.tauxRealisation, 100)}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
