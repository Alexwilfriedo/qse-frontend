import { Button, Card, CardHeader, Input, Modal, SkeletonTable } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCriticalityMatrix, useSaveCriticalityMatrix } from '../hooks/useRiskConfig';
import type { CriticalityLevel, SaveThresholdRequest } from '../types';

const LEVEL_ORDER: CriticalityLevel[] = ['FAIBLE', 'MOYEN', 'ELEVE'];

function levelFromIndex(index: number): CriticalityLevel {
  return LEVEL_ORDER[index] ?? 'ELEVE';
}

function parseCode(code: string): { minValue: number; maxValue: number } {
  const [minRaw, maxRaw] = code.split('_');
  const minValue = Number(minRaw);
  const maxValue = Number(maxRaw);

  if (!Number.isInteger(minValue) || !Number.isInteger(maxValue) || minValue > maxValue) {
    throw new Error('Le code doit être au format min_max, ex: 1_3');
  }

  return { minValue, maxValue };
}

function formatCode(minValue: number, maxValue: number): string {
  return `${minValue}_${maxValue}`;
}

interface ThresholdFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  threshold: SaveThresholdRequest | null;
  onSubmit: (threshold: SaveThresholdRequest) => Promise<void>;
  isPending: boolean;
}

function ThresholdFormModal({
  isOpen,
  onClose,
  threshold,
  onSubmit,
  isPending,
}: ThresholdFormModalProps) {
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#22c55e');

  useEffect(() => {
    if (!isOpen) return;
    setCode(threshold ? formatCode(threshold.minValue, threshold.maxValue) : '');
    setLabel(threshold?.label ?? '');
    setColor(threshold?.color ?? '#22c55e');
  }, [isOpen, threshold]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { minValue, maxValue } = parseCode(code);
    await onSubmit({
      level: threshold?.level ?? 'FAIBLE',
      minValue,
      maxValue,
      label,
      color,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={threshold ? 'Modifier — Criticité' : 'Nouvelle — Criticité'}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder='Ex: 1_3'
          required
        />
        <Input
          label='Label'
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder='Ex: Faible'
          required
        />
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Couleur
          </label>
          <div className='flex items-center gap-3'>
            <input
              type='color'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className='h-10 w-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer'
            />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              pattern='^#[0-9A-Fa-f]{6}$'
              maxLength={7}
              required
            />
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function CriticalityConfigTable() {
  const { data: thresholds, isLoading } = useCriticalityMatrix();
  const saveMutation = useSaveCriticalityMatrix();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useMemo(
    () =>
      thresholds && thresholds.length > 0
        ? [...thresholds]
            .sort((a, b) => a.minValue - b.minValue)
            .map((item) => ({
              level: item.level,
              minValue: item.minValue,
              maxValue: item.maxValue,
              label: item.label,
              color: item.color,
            }))
        : [],
    [thresholds],
  );

  const editingThreshold =
    editingIndex !== null ? (form[editingIndex] ?? null) : null;

  const persist = async (next: SaveThresholdRequest[]) => {
    if (next.length === 0) {
      showToast.error('Au moins un niveau de criticité est requis');
      return;
    }

    const normalized = [...next]
      .sort((a, b) => a.minValue - b.minValue)
      .map((item, index) => ({
        ...item,
        level: levelFromIndex(index),
      }));

    await saveMutation.mutateAsync(normalized);
    showToast.success('Criticité enregistrée');
    setModalOpen(false);
    setEditingIndex(null);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Supprimer ce niveau de criticité ?')) {
      return;
    }

    try {
      await persist(form.filter((_, currentIndex) => currentIndex !== index));
    } catch {
      showToast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleSubmit = async (threshold: SaveThresholdRequest) => {
    try {
      const next = [...form];
      if (editingIndex !== null) {
        next[editingIndex] = threshold;
      } else {
        next.push(threshold);
      }
      await persist(next);
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error("Erreur lors de l'enregistrement");
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title={`Criticité (${form.length})`}
          action={
            <Button
              size='sm'
              onClick={() => {
                setEditingIndex(null);
                setModalOpen(true);
              }}>
              <Plus className='w-4 h-4 mr-1' />
              Ajouter
            </Button>
          }
        />

        {isLoading ? (
          <SkeletonTable rows={3} columns={4} />
        ) : !form.length ? (
          <div className='px-4 py-6 text-center text-sm text-gray-500'>
            Aucune criticité configurée
          </div>
        ) : (
          <table className='min-w-full'>
            <thead className='bg-gray-50 dark:bg-gray-800'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                  Code
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                  Label
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                  Couleur
                </th>
                <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {form.map((threshold, index) => (
                <tr key={`${threshold.minValue}_${threshold.maxValue}`} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <td className='px-4 py-2 font-mono text-sm'>
                    {formatCode(threshold.minValue, threshold.maxValue)}
                  </td>
                  <td className='px-4 py-2 text-sm'>{threshold.label}</td>
                  <td className='px-4 py-2'>
                    <div className='flex items-center gap-2'>
                      <span
                        className='w-4 h-4 rounded-full border border-gray-300'
                        style={{ backgroundColor: threshold.color }}
                      />
                      <span className='font-mono text-xs text-gray-500'>
                        {threshold.color}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-2 text-right'>
                    <div className='flex justify-end gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          setEditingIndex(index);
                          setModalOpen(true);
                        }}>
                        <Edit2 className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(index)}>
                        <Trash2 className='w-4 h-4 text-error-500' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <ThresholdFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIndex(null);
        }}
        threshold={editingThreshold}
        onSubmit={handleSubmit}
        isPending={saveMutation.isPending}
      />
    </>
  );
}
