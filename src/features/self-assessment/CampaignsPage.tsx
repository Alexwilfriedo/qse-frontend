import { Badge, Card, PageHeader, SkeletonTable } from '@/components/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignCreateModal } from './components/CampaignCreateModal';
import { useCampaigns } from './hooks/useSelfAssessmentCampaigns';
import type { CampaignSummaryView } from './types';

const STATUS_LABELS: Record<string, { label: string; variant: string }> = {
  EN_COURS: { label: 'En cours', variant: 'info' },
  CLOTUREE: { label: 'Clôturée', variant: 'success' },
  ARCHIVEE: { label: 'Archivée', variant: 'warning' },
};

export function CampaignsPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  return (
    <div className='space-y-6'>
      <PageHeader
        title="Campagnes d'auto-évaluation"
        description='Lancez et suivez les campagnes de remplissage des grilles QSE'
        actions={
          <button
            type='button'
            className='rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600'
            onClick={() => setShowCreate(true)}>
            Nouvelle campagne
          </button>
        }
      />

      {isLoading ? (
        <SkeletonTable rows={5} columns={6} />
      ) : !campaigns?.length ? (
        <Card>
          <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
            Aucune campagne créée. Lancez votre première campagne.
          </div>
        </Card>
      ) : (
        <Card>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='border-b border-gray-200 dark:border-gray-700'>
                <tr>
                  <th className='px-4 py-3 font-medium text-gray-500'>Titre</th>
                  <th className='px-4 py-3 font-medium text-gray-500'>
                    Échéance
                  </th>
                  <th className='px-4 py-3 font-medium text-gray-500'>
                    Statut
                  </th>
                  <th className='px-4 py-3 font-medium text-gray-500'>
                    Progression
                  </th>
                  <th className='px-4 py-3 font-medium text-gray-500'>
                    Créée le
                  </th>
                  <th className='px-4 py-3 font-medium text-gray-500'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                {campaigns.map((c: CampaignSummaryView) => {
                  const status = STATUS_LABELS[c.statut] ?? {
                    label: c.statut,
                    variant: 'info',
                  };
                  const pct =
                    c.totalResponses > 0
                      ? Math.round(
                          (c.submittedResponses / c.totalResponses) * 100,
                        )
                      : 0;
                  return (
                    <tr
                      key={c.id}
                      className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      onClick={() =>
                        navigate(`/self-assessment/campaigns/${c.id}`)
                      }>
                      <td className='px-4 py-3 font-medium text-gray-900 dark:text-white'>
                        {c.titre}
                      </td>
                      <td className='px-4 py-3 text-gray-600 dark:text-gray-300'>
                        {c.dateEcheance}
                      </td>
                      <td className='px-4 py-3'>
                        <Badge
                          variant={
                            status.variant as 'info' | 'success' | 'warning'
                          }>
                          {status.label}
                        </Badge>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700'>
                            <div
                              className='h-full rounded-full bg-brand-500'
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className='text-xs text-gray-500'>
                            {c.submittedResponses}/{c.totalResponses}
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-3 text-gray-500'>
                        {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className='px-4 py-3 text-right'>
                        <span className='text-brand-500'>→</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showCreate && (
        <CampaignCreateModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
