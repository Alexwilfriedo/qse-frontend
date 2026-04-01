import { Badge, Button, Card, CardHeader, SkeletonTable } from '@/components/ui';
import { actionsApi } from '@/features/actions/actionsApi';
import type { Action } from '@/features/actions/types';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUT_BADGE: Record<
  string,
  { variant: 'info' | 'warning' | 'success' | 'error'; label: string }
> = {
  OUVERTE: { variant: 'info', label: 'Ouverte' },
  EN_COURS: { variant: 'warning', label: 'En cours' },
  TERMINEE: { variant: 'success', label: 'Terminée' },
  VALIDEE: { variant: 'success', label: 'Validée' },
  REFUSEE: { variant: 'error', label: 'Refusée' },
};

interface Props {
  incidentId: string;
  incidentDomaine: string;
  isClosed: boolean;
}

export default function IncidentActionsPanel({
  incidentId,
  incidentDomaine,
  isClosed,
}: Props) {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['actions', 'byIncident', incidentId],
    queryFn: () =>
      actionsApi.getAll({ origineId: incidentId, size: 50 }),
    enabled: !!incidentId,
  });

  const actions = data?.content ?? [];

  const handleCreateAction = () => {
    const params = new URLSearchParams({
      origine: 'INCIDENT',
      origineId: incidentId,
      domaine: incidentDomaine,
      type: 'CORRECTIVE',
    });
    navigate(`/actions?create=true&${params}`);
  };

  return (
    <Card>
      <CardHeader
        title={`Actions correctives (${actions.length})`}
        action={
          !isClosed && (
            <Button variant='ghost' size='sm' onClick={handleCreateAction}>
              <Plus className='mr-1 h-4 w-4' />
              Créer une action
            </Button>
          )
        }
      />
      {isLoading ? (
        <div className='p-4'>
          <SkeletonTable rows={2} columns={4} />
        </div>
      ) : actions.length === 0 ? (
        <div className='px-4 py-6 text-center text-sm text-gray-500'>
          Aucune action corrective liée à cet incident.
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='bg-gray-50 dark:bg-gray-800'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                  Titre
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                  Responsable
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                  Échéance
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                  Statut
                </th>
                <th className='px-4 py-2' />
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {actions.map((action: Action) => {
                const stBadge = STATUT_BADGE[action.statut];
                return (
                  <tr key={action.id} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                    <td className='px-4 py-2 text-sm font-medium'>
                      {action.titre}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-600'>
                      {action.responsableNom}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-600'>
                      {action.echeance}
                    </td>
                    <td className='px-4 py-2'>
                      {stBadge && (
                        <Badge variant={stBadge.variant}>
                          {stBadge.label}
                        </Badge>
                      )}
                    </td>
                    <td className='px-4 py-2 text-right'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => navigate(`/actions/${action.id}`)}>
                        <ExternalLink className='h-4 w-4' />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
