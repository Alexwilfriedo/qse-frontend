import {
  Badge,
  Button,
  Card,
  CardHeader,
  SkeletonTable,
} from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  useCreateMeasure,
  useDeleteMeasure,
  useRiskMeasures,
  useUpdateMeasure,
} from '../hooks/useRisks';
import type {
  CreateMeasureRequest,
  MeasureEffectiveness,
  MitigationStrategy,
  RiskMitigationMeasure,
  UpdateMeasureRequest,
} from '../types';
import MeasureFormModal from './MeasureFormModal';

const STRATEGY_LABEL: Record<MitigationStrategy, string> = {
  ELIMINATION: 'Élimination',
  REDUCTION: 'Réduction',
  TRANSFERT: 'Transfert',
  ACCEPTATION: 'Acceptation',
};

const EFFECTIVENESS_BADGE: Record<
  MeasureEffectiveness,
  { variant: 'info' | 'warning' | 'success' | 'error'; label: string }
> = {
  NON_EVALUEE: { variant: 'info', label: 'Non évaluée' },
  INSUFFISANTE: { variant: 'error', label: 'Insuffisante' },
  PARTIELLE: { variant: 'warning', label: 'Partielle' },
  EFFICACE: { variant: 'success', label: 'Efficace' },
};

interface Props {
  riskId: string;
}

export default function RiskMeasuresPanel({ riskId }: Props) {
  const { data: measures, isLoading } = useRiskMeasures(riskId);
  const createMutation = useCreateMeasure(riskId);
  const updateMutation = useUpdateMeasure(riskId);
  const deleteMutation = useDeleteMeasure(riskId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RiskMitigationMeasure | undefined>();

  const handleCreate = async (
    data: CreateMeasureRequest | UpdateMeasureRequest,
  ) => {
    try {
      await createMutation.mutateAsync(data as CreateMeasureRequest);
      showToast.success('Mesure créée');
      setModalOpen(false);
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  const handleUpdate = async (
    data: CreateMeasureRequest | UpdateMeasureRequest,
  ) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({
        measureId: editing.id,
        data: data as UpdateMeasureRequest,
      });
      showToast.success('Mesure mise à jour');
      setEditing(undefined);
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      showToast.success('Mesure supprimée');
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader
        title='Dispositif de maitrise des risques'
        action={
          <Button size='sm' onClick={() => setModalOpen(true)}>
            <Plus className='mr-1 h-3.5 w-3.5' />
            Ajouter
          </Button>
        }
      />

      <div className='p-4 pt-0'>
        {isLoading ? (
          <SkeletonTable rows={3} columns={4} />
        ) : !measures?.length ? (
          <p className='py-4 text-center text-sm text-gray-500'>
            Aucune mesure de maîtrise définie.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gray-50 dark:bg-gray-800'>
                <tr>
                  <th className='px-3 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                    Strategie
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                    Mesure
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                    Efficacite
                  </th>
                  <th className='px-3 py-2 text-right text-xs font-medium uppercase text-gray-500'>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {measures.map((m) => {
                  const eff = EFFECTIVENESS_BADGE[m.effectiveness];
                  return (
                    <tr key={m.id}>
                      <td className='px-3 py-2 text-sm text-gray-600'>
                        {STRATEGY_LABEL[m.strategy]}
                      </td>
                      <td className='px-3 py-2'>
                        <p className='text-sm font-medium'>{m.title}</p>
                        {m.description && (
                          <p className='text-xs text-gray-500 line-clamp-1'>
                            {m.description}
                          </p>
                        )}
                      </td>
                      <td className='px-3 py-2'>
                        <Badge variant={eff.variant}>{eff.label}</Badge>
                      </td>
                      <td className='px-3 py-2 text-right'>
                        <div className='flex justify-end gap-1'>
                          <button
                            onClick={() => setEditing(m)}
                            className='rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700'>
                            <Pencil className='h-3.5 w-3.5' />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className='rounded p-1 text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-gray-700'>
                            <Trash2 className='h-3.5 w-3.5' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MeasureFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />

      <MeasureFormModal
        isOpen={!!editing}
        onClose={() => setEditing(undefined)}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
        measure={editing}
      />
    </Card>
  );
}
