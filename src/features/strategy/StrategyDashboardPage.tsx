import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { useStrategyDashboard } from './hooks/useStrategy';

export function StrategyDashboardPage() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading, isError, error } = useStrategyDashboard();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Contexte & Stratégie
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className='h-32' />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    return (
      <div className='space-y-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Contexte & Stratégie
        </h1>
        <div className='rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950'>
          <p className='text-sm font-medium text-red-600 dark:text-red-400'>
            {status === 403
              ? "Vous n'avez pas la permission d'accéder au module Contexte & Stratégie."
              : 'Erreur lors du chargement du module Contexte & Stratégie.'}
          </p>
          <p className='mt-1 text-xs text-red-500'>
            {status === 403
              ? 'Contactez votre administrateur pour obtenir la permission "strategy:read".'
              : "Veuillez réessayer ou contacter l'administrateur."}
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Documents stratégiques',
      total: dashboard?.totalDocuments ?? 0,
      alert: dashboard?.documentsNeedingRevision ?? 0,
      alertLabel: 'à réviser',
      href: '/strategy/documents',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Parties intéressées',
      total: dashboard?.totalStakeholders ?? 0,
      alert: dashboard?.stakeholdersNeedingRevision ?? 0,
      alertLabel: 'à réviser',
      href: '/strategy/stakeholders',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Objectifs stratégiques',
      total: dashboard?.totalObjectives ?? 0,
      alert: dashboard?.objectivesEnEcart ?? 0,
      alertLabel: 'en écart',
      href: '/strategy/objectives',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Veille réglementaire',
      total: dashboard?.totalRegulatoryWatches ?? 0,
      alert: dashboard?.watchesNeedingReview ?? 0,
      alertLabel: 'à revoir',
      href: '/strategy/regulatory',
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-gray-900'>Contexte & Stratégie</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {cards.map((card) => (
          <Card
            key={card.title}
            className='cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => navigate(card.href)}>
            <h3 className='text-sm font-medium text-gray-500 mb-3'>
              {card.title}
            </h3>
            <div className='flex items-end justify-between'>
              <span
                className={`text-3xl font-bold ${card.color.split(' ')[1]}`}>
                {card.total}
              </span>
              {card.alert > 0 && (
                <Badge variant='error'>
                  {card.alert} {card.alertLabel}
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
