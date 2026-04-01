import { Badge, DataTable } from '@/components/ui';
import { Download } from 'lucide-react';
import type { AesMeasurement } from '../aesTypes';
import { AES_AXES } from '../aesTypes';
import { aesApi } from '../aesApi';

const AXIS_LABELS = Object.fromEntries(AES_AXES.map((a) => [a.code, a.label]));

const STATUS_BADGE: Record<string, { variant: 'success' | 'warning' | 'error'; label: string }> = {
  CONFORME: { variant: 'success', label: 'Conforme' },
  A_SURVEILLER: { variant: 'warning', label: 'À surveiller' },
  NON_CONFORME: { variant: 'error', label: 'Non conforme' },
};

interface AesMeasurementTableProps {
  measurements: AesMeasurement[];
  isLoading: boolean;
}

export function AesMeasurementTable({ measurements, isLoading }: AesMeasurementTableProps) {
  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (m: AesMeasurement) => (
        <span className='text-sm'>
          {new Date(m.dateMesure).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'site',
      header: 'Site',
      render: (m: AesMeasurement) => (
        <span className='font-medium text-gray-900 dark:text-gray-100'>
          {m.siteName}
        </span>
      ),
    },
    {
      key: 'axis',
      header: 'Axe de la Norme',
      render: (m: AesMeasurement) => (
        <span className='text-sm'>{AXIS_LABELS[m.axisCode] ?? m.axisCode}</span>
      ),
    },
    {
      key: 'indicator',
      header: 'Indicateur (KPI)',
      render: (m: AesMeasurement) => (
        <span className='font-medium text-sm'>{m.indicatorName}</span>
      ),
    },
    {
      key: 'realized',
      header: 'Valeur Réalisée',
      render: (m: AesMeasurement) => (
        <span className='font-semibold'>{m.realizedValue}</span>
      ),
    },
    {
      key: 'target',
      header: 'Objectif Cible',
      render: (m: AesMeasurement) => <span>{m.targetValue}</span>,
    },
    {
      key: 'unit',
      header: 'Unité de mesure',
      render: (m: AesMeasurement) => <span>{m.unit}</span>,
    },
    {
      key: 'status',
      header: 'Statut (Auto)',
      render: (m: AesMeasurement) => {
        const s = STATUS_BADGE[m.status];
        return s ? <Badge variant={s.variant}>{s.label}</Badge> : m.status;
      },
    },
    {
      key: 'proof',
      header: 'Preuve',
      render: (m: AesMeasurement) =>
        m.proofFileName ? (
          <a
            href={aesApi.downloadProofUrl(m.id)}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 text-sm'
            title={m.proofFileName}>
            <Download className='w-4 h-4' />
            <span className='truncate max-w-[120px]'>{m.proofFileName}</span>
          </a>
        ) : (
          <span className='text-gray-400 text-sm'>—</span>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={measurements}
      isLoading={isLoading}
      keyExtractor={(m) => m.id}
      emptyMessage='Aucune mesure enregistrée'
    />
  );
}
