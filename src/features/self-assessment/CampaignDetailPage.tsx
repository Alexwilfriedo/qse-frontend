import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Card, PageHeader, SkeletonTable } from '@/components/ui';
import {
  useCampaign,
  useCloseCampaign,
} from './hooks/useSelfAssessmentCampaigns';
import type { CampaignResponseView } from './types';

const STATUS_LABELS: Record<string, { label: string; variant: string }> = {
  EN_COURS: { label: 'En cours', variant: 'info' },
  CLOTUREE: { label: 'Clôturée', variant: 'success' },
  ARCHIVEE: { label: 'Archivée', variant: 'warning' },
};

const RESPONSE_STATUS: Record<string, { label: string; variant: string }> = {
  EN_ATTENTE: { label: 'En attente', variant: 'warning' },
  BROUILLON: { label: 'Brouillon', variant: 'info' },
  SOUMIS: { label: 'Soumis', variant: 'success' },
  VALIDE: { label: 'Validé', variant: 'success' },
};

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: campaign, isLoading } = useCampaign(id);
  const closeMutation = useCloseCampaign();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Chargement...' />
        <SkeletonTable rows={5} columns={5} />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Campagne introuvable' />
      </div>
    );
  }

  const status = STATUS_LABELS[campaign.statut] ?? {
    label: campaign.statut,
    variant: 'info',
  };

  const handleClose = () => {
    if (!id) return;
    closeMutation.mutate(id);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title={campaign.titre}
        description={`Échéance : ${campaign.dateEcheance}`}
        actions={
          <div className='flex items-center gap-3'>
            <Badge variant={status.variant as 'info' | 'success' | 'warning'}>
              {status.label}
            </Badge>
            {campaign.statut === 'EN_COURS' && (
              <button
                type='button'
                className='rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20'
                onClick={handleClose}
                disabled={closeMutation.isPending}
              >
                Clôturer
              </button>
            )}
          </div>
        }
      />

      <Card>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='border-b border-gray-200 dark:border-gray-700'>
              <tr>
                <th className='px-4 py-3 font-medium text-gray-500'>
                  Processus
                </th>
                <th className='px-4 py-3 font-medium text-gray-500'>Pilote</th>
                <th className='px-4 py-3 font-medium text-gray-500'>Statut</th>
                <th className='px-4 py-3 font-medium text-gray-500'>
                  Date réponse
                </th>
                <th className='px-4 py-3 font-medium text-gray-500'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
              {campaign.responses.map((r: CampaignResponseView) => {
                const rs = RESPONSE_STATUS[r.statut] ?? {
                  label: r.statut,
                  variant: 'info',
                };
                return (
                  <tr key={r.id}>
                    <td className='px-4 py-3 font-medium text-gray-900 dark:text-white'>
                      {r.processId.slice(0, 8)}...
                    </td>
                    <td className='px-4 py-3 text-gray-600 dark:text-gray-300'>
                      {r.piloteId.slice(0, 8)}...
                    </td>
                    <td className='px-4 py-3'>
                      <Badge
                        variant={
                          rs.variant as 'info' | 'success' | 'warning'
                        }
                      >
                        {rs.label}
                      </Badge>
                    </td>
                    <td className='px-4 py-3 text-gray-500'>
                      {r.dateReponse
                        ? new Date(r.dateReponse).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <button
                        type='button'
                        className='text-sm text-brand-500 hover:text-brand-600'
                        onClick={() =>
                          navigate(
                            `/self-assessment/campaigns/${id}/fill/${r.processId}`,
                          )
                        }
                      >
                        {r.statut === 'EN_ATTENTE' || r.statut === 'BROUILLON'
                          ? 'Remplir'
                          : 'Voir'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
