import { Button, Card, CardHeader, Input, Modal, SkeletonTable } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRiskScale, useSaveScale } from '../hooks/useRiskConfig';
import type { ScaleType } from '../types';

const SCALE_LABELS: Record<ScaleType, string> = {
  FREQUENCY: 'Fréquence',
  SEVERITY: 'Gravité',
  MASTERY: 'Maîtrise',
};

interface Props {
  type: ScaleType;
}

interface LevelForm {
  value: number;
  label: string;
  color: string;
}

interface ScaleLevelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValue: LevelForm | null;
  existingValues: number[];
  onSubmit: (level: LevelForm) => Promise<void>;
  isPending: boolean;
}

function ScaleLevelFormModal({
  isOpen,
  onClose,
  title,
  initialValue,
  existingValues,
  onSubmit,
  isPending,
}: ScaleLevelFormModalProps) {
  const [form, setForm] = useState<LevelForm>({
    value: 1,
    label: '',
    color: '#6B7280',
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(
      initialValue ?? {
        value: Math.max(1, ...existingValues, 0) + 1,
        label: '',
        color: '#6B7280',
      },
    );
  }, [existingValues, initialValue, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Code (note)'
          type='number'
          min={1}
          value={String(form.value)}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              value: Math.max(1, Number(e.target.value) || 1),
            }))
          }
          required
        />

        <Input
          label='Label'
          value={form.label}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, label: e.target.value }))
          }
          required
        />

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Couleur
          </label>
          <div className='flex items-center gap-3'>
            <input
              type='color'
              value={form.color}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, color: e.target.value }))
              }
              className='h-10 w-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer'
            />
            <Input
              value={form.color}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, color: e.target.value }))
              }
              maxLength={7}
              pattern='^#[0-9A-Fa-f]{6}$'
              className='flex-1'
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

export default function ScaleEditor({ type }: Props) {
  const { data: scale, isLoading } = useRiskScale(type);
  const saveMutation = useSaveScale();
  const [levels, setLevels] = useState<LevelForm[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelForm | null>(null);

  useEffect(() => {
    if (scale) {
      setLevels(
        scale.levels
          .map((l) => ({ value: l.value, label: l.label, color: l.color }))
          .sort((a, b) => a.value - b.value),
      );
    } else {
      const defaultMax = type === 'SEVERITY' ? 5 : 4;
      setLevels(
        Array.from({ length: defaultMax }, (_, i) => ({
          value: i + 1,
          label: '',
          color: '#6B7280',
        })),
      );
    }
  }, [scale, type]);

  const persistLevels = async (nextLevels: LevelForm[]) => {
    const sortedLevels = [...nextLevels].sort((a, b) => a.value - b.value);
    const uniqueValues = new Set(sortedLevels.map((level) => level.value));

    if (sortedLevels.length < 2) {
      showToast.error("L'échelle doit contenir au moins 2 niveaux");
      return;
    }

    if (uniqueValues.size !== sortedLevels.length) {
      showToast.error('Chaque note doit être unique');
      return;
    }

    if (sortedLevels.some((level) => !level.label.trim())) {
      showToast.error('Chaque niveau doit avoir un label');
      return;
    }

    const maxValue = Math.max(...sortedLevels.map((level) => level.value));

    try {
      await saveMutation.mutateAsync({
        type,
        label: SCALE_LABELS[type],
        maxValue,
        levels: sortedLevels,
      });
      setLevels(sortedLevels);
      showToast.success(`Échelle "${SCALE_LABELS[type]}" enregistrée`);
    } catch {
      showToast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleSubmitLevel = async (level: LevelForm) => {
    const nextLevels = editingLevel
      ? levels.map((item) => (item.value === editingLevel.value ? level : item))
      : [...levels, level];

    await persistLevels(nextLevels);
    setModalOpen(false);
    setEditingLevel(null);
  };

  const handleDelete = async (level: LevelForm) => {
    if (
      !confirm(`Supprimer le niveau ${level.value} de l'échelle "${SCALE_LABELS[type]}" ?`)
    ) {
      return;
    }

    await persistLevels(levels.filter((item) => item.value !== level.value));
  };

  return (
    <>
      <Card>
      <CardHeader
        title={SCALE_LABELS[type]}
        action={
          <Button
            size='sm'
            onClick={() => {
              setEditingLevel(null);
              setModalOpen(true);
            }}>
            <Plus className='w-4 h-4 mr-1' />
            Ajouter
          </Button>
        }
      />

      {isLoading ? (
        <SkeletonTable rows={4} columns={4} />
      ) : !levels.length ? (
        <div className='px-4 py-6 text-center text-sm text-gray-500'>
          Aucun niveau configuré
        </div>
      ) : (
        <table className='min-w-full'>
          <thead className='bg-gray-50 dark:bg-gray-800'>
            <tr>
              <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                Code (note)
              </th>
              <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                Label
              </th>
              <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
                Couleur
              </th>
              <th className='px-4 py-2 text-right text-xs font-medium uppercase text-gray-500'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
            {levels.map((level) => (
              <tr key={level.value} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                <td className='px-4 py-2 font-mono text-sm font-semibold'>
                  {level.value}
                </td>
                <td className='px-4 py-2 text-sm'>{level.label}</td>
                <td className='px-4 py-2'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='w-4 h-4 rounded-full border border-gray-300'
                      style={{ backgroundColor: level.color }}
                    />
                    <span className='font-mono text-xs text-gray-500'>
                      {level.color}
                    </span>
                  </div>
                </td>
                <td className='px-4 py-2 text-right'>
                  <div className='flex justify-end gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setEditingLevel(level);
                        setModalOpen(true);
                      }}>
                      <Edit2 className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(level)}
                      disabled={saveMutation.isPending}>
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

      <ScaleLevelFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingLevel(null);
        }}
        title={
          editingLevel
            ? `Modifier — ${SCALE_LABELS[type]}`
            : `Nouveau — ${SCALE_LABELS[type]}`
        }
        initialValue={editingLevel}
        existingValues={levels.map((level) => level.value)}
        onSubmit={handleSubmitLevel}
        isPending={saveMutation.isPending}
      />
    </>
  );
}
