import { Button, Card, CardHeader, PageHeader, Select } from '@/components/ui';
import { actionsApi } from '@/features/actions/actionsApi';
import type { CreateActionRequest } from '@/features/actions/types';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CreateKpiReportIndicatorModal } from './components/CreateKpiReportIndicatorModal';
import { KpiReportDashboardCards } from './components/KpiReportDashboardCards';
import { KpiReportIndicatorTable } from './components/KpiReportIndicatorTable';
import {
  useCreateKpiReportIndicator,
  useKpiReportIndicators,
  useKpiReportStats,
} from './hooks/useKpiReport';
import type {
  ActionEntry,
  CreateKpiReportIndicatorRequest,
} from './kpiReportTypes';

const currentYear = new Date().getFullYear();
const PERIOD_OPTIONS = Array.from({ length: 5 }, (_, i) => {
  const year = currentYear - i;
  return { value: String(year), label: String(year) };
});

export default function KpiReportSmqPage() {
  const [period, setPeriod] = useState(String(currentYear));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useKpiReportStats(
    'SMQ',
    period,
  );
  const { data: indicators = [], isLoading: indicatorsLoading } =
    useKpiReportIndicators('SMQ', period);

  const createMutation = useCreateKpiReportIndicator('SMQ');

  const handleCreateIndicator = async (
    data: CreateKpiReportIndicatorRequest,
    actions: ActionEntry[],
  ) => {
    createMutation.mutate(data, {
      onSuccess: async (indicator) => {
        // Créer les actions d'amélioration liées
        if (actions.length > 0) {
          const actionPromises = actions.map((a) =>
            actionsApi.create({
              titre: a.titre,
              description: `Indicateur : ${data.name} (${data.code})\nProcessus : ${data.processName}\nCible : ${data.target} ${data.unit}${data.result != null ? `\nRésultat : ${data.result} ${data.unit}` : ''}`,
              type: a.type as CreateActionRequest['type'],
              priorite: (a.priorite || 'MOYENNE') as CreateActionRequest['priorite'],
              domaine: 'QUALITE',
              responsableId: a.responsableId,
              echeance: a.echeance,
              origine: 'AUTRE',
              origineId: indicator.id,
            }),
          );
          try {
            await Promise.all(actionPromises);
            queryClient.invalidateQueries({ queryKey: ['actions'] });
          } catch (error) {
            showToast.error(getApiErrorMessage(error));
          }
        }
        showToast.success(
          actions.length > 0
            ? `Indicateur enregistré avec ${actions.length} action(s)`
            : 'Indicateur enregistré',
        );
        setIsCreateModalOpen(false);
      },
      onError: (error) => {
        showToast.error(getApiErrorMessage(error));
      },
    });
  };

  // Compute stats locally from indicators as fallback
  const computedStats = useMemo(() => {
    if (stats) return stats;
    const total = indicators.length;
    const reached = indicators.filter(
      (i) => i.targetStatus === 'ATTEINT',
    ).length;
    const notReached = indicators.filter(
      (i) => i.targetStatus === 'NON_ATTEINT',
    ).length;
    return {
      totalIndicators: total,
      targetReached: reached,
      targetNotReached: notReached,
      effectivenessRate: total > 0 ? (reached / total) * 100 : 0,
    };
  }, [stats, indicators]);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Tableau de bord Qualité'
        description='Mesure de la Performance et Efficacité du SMQ'
        actions={
          <div className='flex items-center gap-3'>
            <Select
              placeholder='Période'
              options={PERIOD_OPTIONS}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <Button
              leftIcon={<Plus className='w-4 h-4' />}
              onClick={() => setIsCreateModalOpen(true)}
              className='whitespace-nowrap'>
              Nouvel indicateur
            </Button>
          </div>
        }
      />

      <KpiReportDashboardCards
        stats={computedStats}
        isLoading={statsLoading && indicatorsLoading}
      />

      <Card>
        <CardHeader
          title='Indicateurs de la période'
          description={`${indicators.length} indicateur(s) enregistré(s) pour ${period}`}
        />
        <KpiReportIndicatorTable
          indicators={indicators}
          isLoading={indicatorsLoading}
        />
      </Card>

      <CreateKpiReportIndicatorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateIndicator}
        isLoading={createMutation.isPending}
        domain='SMQ'
        period={period}
      />

    </div>
  );
}
