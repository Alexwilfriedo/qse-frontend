import {
  Card,
  CardHeader,
  PageHeader,
  Select,
  SkeletonCard,
} from '@/components/ui';
import { useProcessMap } from '@/features/cartography/hooks/useProcessMap';
import { type ChangeEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MaturityEvolutionChart } from './components/MaturityEvolutionChart';
import { MaturityRadarChart } from './components/MaturityRadarChart';
import { ParticipationWidget } from './components/ParticipationWidget';
import { ProcessMaturityRanking } from './components/ProcessMaturityRanking';
import {
  useCampaigns,
  useDashboard,
  useEvolution,
} from './hooks/useSelfAssessmentCampaigns';

export default function MaturityDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const campaignIdParam = searchParams.get('campaignId') ?? undefined;

  const { data: campaigns, isLoading: loadingCampaigns } = useCampaigns();
  const [selectedProcessId, setSelectedProcessId] = useState<
    string | undefined
  >();

  const activeCampaignId = campaignIdParam ?? campaigns?.[0]?.id;
  const { data: dashboard, isLoading: loadingDashboard } =
    useDashboard(activeCampaignId);
  const { data: evolution } = useEvolution(selectedProcessId);

  const { data: processMap } = useProcessMap();
  const processNames: Record<string, string> = {};
  if (processMap) {
    [
      ...processMap.management,
      ...processMap.realisation,
      ...processMap.support,
    ].forEach((p) => {
      processNames[p.id] = p.nom;
    });
  }

  const campaignOptions = (campaigns ?? []).map((c) => ({
    value: c.id,
    label: c.titre,
  }));

  function handleCampaignChange(e: ChangeEvent<HTMLSelectElement>) {
    setSearchParams({ campaignId: e.target.value });
  }

  if (loadingCampaigns) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Dashboard Maturité' />
        <div className='grid gap-6 md:grid-cols-2'>
          <SkeletonCard /> <SkeletonCard /> <SkeletonCard /> <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Dashboard Maturité'
        description="Vue d'ensemble des scores de maturité par campagne"
        actions={
          <div className='w-64'>
            <Select
              options={campaignOptions}
              value={activeCampaignId ?? ''}
              onChange={handleCampaignChange}
              placeholder='Sélectionner une campagne'
            />
          </div>
        }
      />

      {loadingDashboard ? (
        <div className='grid gap-6 md:grid-cols-2'>
          <SkeletonCard /> <SkeletonCard /> <SkeletonCard /> <SkeletonCard />
        </div>
      ) : dashboard ? (
        <>
          {/* Score global */}
          <div className='grid gap-6 md:grid-cols-3'>
            <Card>
              <CardHeader title='Note Globale SMI' />
              <div className='flex items-center justify-center py-6'>
                <span
                  className={`text-5xl font-bold ${
                    dashboard.noteGlobale >= 75
                      ? 'text-success-500'
                      : dashboard.noteGlobale >= 50
                        ? 'text-warning-500'
                        : 'text-error-500'
                  }`}>
                  {dashboard.noteGlobale}
                </span>
                <span className='ml-1 text-xl text-gray-400'>/100</span>
              </div>
            </Card>

            <Card className='md:col-span-2'>
              <CardHeader title='Participation' />
              <div className='p-4'>
                <ParticipationWidget
                  tauxParticipation={dashboard.tauxParticipation}
                  reponsesRecues={dashboard.reponsesRecues}
                  totalReponses={dashboard.totalReponses}
                />
              </div>
            </Card>
          </div>

          {/* Radar + Classement */}
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader title='Radar de Maturité par Axe' />
              <div className='p-4'>
                <MaturityRadarChart data={dashboard.radar} />
              </div>
            </Card>

            <Card>
              <CardHeader title='Classement des Processus' />
              <div className='p-4'>
                <ProcessMaturityRanking
                  data={dashboard.classement}
                  processNames={processNames}
                />
              </div>
            </Card>
          </div>

          {/* Evolution */}
          <Card>
            <CardHeader title='Évolution de la Maturité' />
            <div className='p-4'>
              <div className='mb-3 w-64'>
                <Select
                  options={dashboard.classement.map((c) => ({
                    value: c.processId,
                    label: processNames[c.processId] ?? c.processId.slice(0, 8),
                  }))}
                  value={selectedProcessId ?? ''}
                  onChange={(e) => setSelectedProcessId(e.target.value)}
                  placeholder='Sélectionner un processus'
                />
              </div>
              {selectedProcessId && evolution ? (
                <MaturityEvolutionChart data={evolution} />
              ) : (
                <div className='flex h-[240px] items-center justify-center text-sm text-gray-400'>
                  Sélectionnez un processus pour voir son évolution
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <div className='py-12 text-center text-gray-400'>
            Aucune campagne sélectionnée ou aucune donnée disponible.
          </div>
        </Card>
      )}
    </div>
  );
}
