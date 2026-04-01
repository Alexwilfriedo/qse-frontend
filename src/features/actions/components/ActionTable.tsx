import { Badge, DataTable, DomainBadge } from '@/components/ui';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ACTION_TYPE_LABELS } from '../actionOptions';
import type { Action } from '../types';

interface ActionTableProps {
  actions: Action[] | undefined;
  isLoading: boolean;
}

const PRIORITE_COLORS: Record<string, string> = {
  CRITIQUE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  HAUTE:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  MOYENNE:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  BASSE: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const STATUT_COLORS: Record<string, string> = {
  OUVERTE: 'bg-blue-100 text-blue-800',
  EN_COURS: 'bg-yellow-100 text-yellow-800',
  TERMINEE: 'bg-green-100 text-green-800',
  VALIDEE: 'bg-emerald-100 text-emerald-800',
  REFUSEE: 'bg-red-100 text-red-800',
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  CORRECTIVE: {
    label: ACTION_TYPE_LABELS.CORRECTIVE,
    color: 'bg-orange-100 text-orange-800',
  },
  PREVENTIVE: {
    label: ACTION_TYPE_LABELS.PREVENTIVE,
    color: 'bg-purple-100 text-purple-800',
  },
  CURATIVE: {
    label: ACTION_TYPE_LABELS.CURATIVE,
    color: 'bg-cyan-100 text-cyan-800',
  },
  AMELIORATION: {
    label: ACTION_TYPE_LABELS.AMELIORATION,
    color: 'bg-emerald-100 text-emerald-800',
  },
};

export function ActionTable({ actions, isLoading }: ActionTableProps) {
  const navigate = useNavigate();

  const columns = [
    {
      key: 'titre',
      header: 'Titre',
      render: (a: Action) => (
        <div className='flex flex-col'>
          <button
            onClick={() => navigate(`/actions/${a.id}`)}
            className='text-sm font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 text-left'>
            {a.titre}
          </button>
          {a.enRetard && (
            <span className='text-xs text-red-600'>En retard</span>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (a: Action) => (
        <Badge className={TYPE_CONFIG[a.type]?.color}>
          {TYPE_CONFIG[a.type]?.label || a.type}
        </Badge>
      ),
    },
    {
      key: 'domaine',
      header: 'Domaine',
      render: (a: Action) => (
        <DomainBadge
          domain={
            a.domaine.toLowerCase() as 'qualite' | 'securite' | 'environnement'
          }
        />
      ),
    },
    {
      key: 'priorite',
      header: 'Priorité',
      render: (a: Action) => (
        <Badge className={PRIORITE_COLORS[a.priorite]}>{a.priorite}</Badge>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (a: Action) => (
        <Badge className={STATUT_COLORS[a.statut]}>
          {a.statut.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'responsable',
      header: 'Responsable',
      render: (a: Action) => (
        <span className='text-sm text-gray-600 dark:text-gray-300'>
          {a.responsableNom}
        </span>
      ),
    },
    {
      key: 'echeance',
      header: 'Échéance',
      render: (a: Action) => (
        <span className='text-sm text-gray-600 dark:text-gray-300'>
          {new Date(a.echeance).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (a: Action) => (
        <div className='flex justify-end'>
          <button
            onClick={() => navigate(`/actions/${a.id}`)}
            className='p-1.5 text-brand-500 hover:text-brand-700 hover:bg-brand-50 dark:text-brand-400 dark:hover:text-brand-300 dark:hover:bg-brand-900/20 rounded-lg transition-colors'
            title='Voir les détails'>
            <Eye className='h-4 w-4' />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={actions}
      isLoading={isLoading}
      keyExtractor={(a) => a.id}
      emptyMessage='Aucune action trouvée'
      skeletonRows={5}
    />
  );
}
