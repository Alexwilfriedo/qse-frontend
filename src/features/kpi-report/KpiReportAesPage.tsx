import { Button, Card, CardHeader, PageHeader, Select } from '@/components/ui';
import { useEntityTree } from '@/features/cartography/hooks/useEntityTree';
import type { EntityTreeNode } from '@/features/cartography/types';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { aesApi } from './aesApi';
import { AES_AXES } from './aesTypes';
import type { AesAxisCode, CreateAesMeasurementRequest } from './aesTypes';
import { AesCharts } from './components/AesCharts';
import { AesMeasurementTable } from './components/AesMeasurementTable';
import { AesReferenceTable } from './components/AesReferenceTable';
import { CreateAesMeasurementModal } from './components/CreateAesMeasurementModal';
import {
  useAesMeasurements,
  useCreateAesMeasurement,
} from './hooks/useAes';

const AXIS_FILTER_OPTIONS = [
  { value: '', label: 'Tous les axes' },
  ...AES_AXES.map((a) => ({ value: a.code, label: a.label })),
];

export default function KpiReportAesPage() {
  const [siteFilter, setSiteFilter] = useState('');
  const [axisFilter, setAxisFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: entityTree } = useEntityTree();
  const flattenSites = (nodes: EntityTreeNode[]): { value: string; label: string }[] =>
    nodes.flatMap((node) => [
      ...(node.type === 'SITE' ? [{ value: node.id, label: node.nom }] : []),
      ...flattenSites(node.children),
    ]);
  const siteOptions = useMemo(
    () => [
      { value: '', label: 'Tous les sites' },
      ...(entityTree ? flattenSites(entityTree) : []),
    ],
    [entityTree],
  );

  const { data: measurements = [], isLoading } = useAesMeasurements(
    siteFilter || undefined,
    (axisFilter as AesAxisCode) || undefined,
  );

  const createMutation = useCreateAesMeasurement();

  const handleCreate = async (
    data: CreateAesMeasurementRequest,
    proofFile?: File | null,
  ) => {
    createMutation.mutate(data, {
      onSuccess: async (measurement) => {
        if (proofFile) {
          try {
            await aesApi.uploadProof(measurement.id, proofFile);
          } catch (err) {
            showToast.warning('Mesure créée mais erreur lors de l\'upload de la preuve');
          }
        }
        showToast.success('Mesure enregistrée');
        setIsCreateOpen(false);
      },
      onError: (error) => {
        showToast.error(getApiErrorMessage(error));
      },
    });
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Tableau de bord AES'
        description="Analyse Environnementale et Sociétale — Indicateurs par site et axe de la norme"
        actions={
          <div className='flex items-center gap-3'>
            <Select
              placeholder='Site'
              options={siteOptions}
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            />
            <Select
              placeholder='Axe'
              options={AXIS_FILTER_OPTIONS}
              value={axisFilter}
              onChange={(e) => setAxisFilter(e.target.value)}
            />
            <Button
              leftIcon={<Plus className='w-4 h-4' />}
              onClick={() => setIsCreateOpen(true)}
              className='whitespace-nowrap'>
              Nouvelle mesure
            </Button>
          </div>
        }
      />

      {/* Graphiques */}
      <AesCharts measurements={measurements} />

      {/* Tableau de référence des axes */}
      <Card>
        <CardHeader
          title='Axes de la Norme'
          description='Indicateurs clés, objectifs cibles et justifications'
        />
        <AesReferenceTable />
      </Card>

      {/* Tableau des mesures */}
      <Card>
        <CardHeader
          title='Mesures enregistrées'
          description={`${measurements.length} mesure(s)`}
        />
        <AesMeasurementTable measurements={measurements} isLoading={isLoading} />
      </Card>

      <CreateAesMeasurementModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreate}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
