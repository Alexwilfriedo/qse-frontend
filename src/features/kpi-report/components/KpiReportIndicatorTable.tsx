import { Badge, DataTable } from '@/components/ui';
import type { KpiReportIndicator } from '../kpiReportTypes';

const FREQUENCY_LABELS: Record<string, string> = {
  MENSUEL: 'Mensuel',
  TRIMESTRIEL: 'Trimestriel',
  SEMESTRIEL: 'Semestriel',
  ANNUEL: 'Annuel',
};

interface KpiReportIndicatorTableProps {
  indicators: KpiReportIndicator[];
  isLoading: boolean;
}

export function KpiReportIndicatorTable({
  indicators,
  isLoading,
}: KpiReportIndicatorTableProps) {
  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (item: KpiReportIndicator) => (
        <span className='font-mono text-xs'>{item.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'Indicateur',
      render: (item: KpiReportIndicator) => (
        <div>
          <p className='font-medium text-gray-900 dark:text-gray-100'>
            {item.name}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {item.processName}
          </p>
        </div>
      ),
    },
    {
      key: 'target',
      header: 'Cible',
      render: (item: KpiReportIndicator) => (
        <span>
          {item.target} {item.unit}
        </span>
      ),
    },
    {
      key: 'result',
      header: 'Résultat',
      render: (item: KpiReportIndicator) =>
        item.result != null ? (
          <span className='font-semibold'>
            {item.result} {item.unit}
          </span>
        ) : (
          <span className='text-gray-400'>—</span>
        ),
    },
    {
      key: 'targetStatus',
      header: 'Cible',
      render: (item: KpiReportIndicator) => {
        if (!item.targetStatus) {
          return <Badge variant='default'>Non calculé</Badge>;
        }
        return item.targetStatus === 'ATTEINT' ? (
          <Badge variant='success'>Atteint</Badge>
        ) : (
          <Badge variant='error'>Non atteint</Badge>
        );
      },
    },
    {
      key: 'frequency',
      header: 'Périodicité',
      render: (item: KpiReportIndicator) =>
        FREQUENCY_LABELS[item.calculationFrequency] ??
        item.calculationFrequency,
    },
    {
      key: 'responsible',
      header: 'Resp. calcul',
      render: (item: KpiReportIndicator) => (
        <span className='text-sm'>{item.calculationResponsibleName}</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={indicators}
      isLoading={isLoading}
      keyExtractor={(item) => item.id}
      emptyMessage='Aucun indicateur enregistré pour cette période'
    />
  );
}
