import { Button, DatePicker, Input, Select, SidePanel } from '@/components/ui';
import { ResponsableSelector } from '@/features/actions/components/ResponsableSelector';
import type { CreateActionRequest } from '@/features/actions/types';
import { useEffect, useState } from 'react';
import type { KpiReportIndicator } from '../kpiReportTypes';

interface CreateActionFromIndicatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateActionRequest) => void;
  isLoading: boolean;
  indicator: KpiReportIndicator | null;
}

const ACTION_TYPE_OPTIONS = [
  { value: 'CORRECTIVE', label: 'Corrective' },
  { value: 'PREVENTIVE', label: 'Préventive' },
];

const PRIORITY_OPTIONS = [
  { value: 'BASSE', label: 'Basse' },
  { value: 'MOYENNE', label: 'Moyenne' },
  { value: 'HAUTE', label: 'Haute' },
  { value: 'CRITIQUE', label: 'Critique' },
];

export function CreateActionFromIndicatorPanel({
  isOpen,
  onClose,
  onSave,
  isLoading,
  indicator,
}: CreateActionFromIndicatorPanelProps) {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'CORRECTIVE',
    priorite: 'MOYENNE',
    responsableId: '',
    echeance: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (indicator && isOpen) {
      setFormData({
        titre: `Action corrective — ${indicator.name} (${indicator.code})`,
        description: [
          `Indicateur : ${indicator.name} (${indicator.code})`,
          `Processus : ${indicator.processName}`,
          `Cible : ${indicator.target} ${indicator.unit}`,
          `Résultat : ${indicator.result} ${indicator.unit}`,
          indicator.rootCause ? `Cause racine : ${indicator.rootCause}` : '',
          indicator.measureAnalysis
            ? `Analyse : ${indicator.measureAnalysis}`
            : '',
        ]
          .filter(Boolean)
          .join('\n'),
        type: 'CORRECTIVE',
        priorite: 'MOYENNE',
        responsableId: '',
        echeance: '',
      });
      setErrors({});
    }
  }, [indicator, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.titre.trim()) newErrors.titre = 'Titre requis';
    if (!formData.responsableId)
      newErrors.responsableId = 'Responsable requis';
    if (!formData.echeance) newErrors.echeance = 'Échéance requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !indicator) return;

    onSave({
      titre: formData.titre,
      description: formData.description || undefined,
      type: formData.type as CreateActionRequest['type'],
      priorite: formData.priorite as CreateActionRequest['priorite'],
      domaine: 'QUALITE',
      responsableId: formData.responsableId,
      echeance: formData.echeance,
      origine: 'AUTRE',
      origineId: indicator.id,
    });
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="Créer une action"
      width='lg'>
      {indicator && (
        <div className='mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4'>
          <p className='text-sm font-medium text-red-800 dark:text-red-300'>
            Cible non atteinte
          </p>
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            <strong>{indicator.code}</strong> — {indicator.name} :{' '}
            {indicator.result} {indicator.unit} (cible : {indicator.target}{' '}
            {indicator.unit})
          </p>
          {indicator.rootCause && (
            <p className='mt-1 text-xs text-red-500 dark:text-red-400'>
              Cause racine : {indicator.rootCause}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Titre'
          required
          value={formData.titre}
          onChange={(e) =>
            setFormData((p) => ({ ...p, titre: e.target.value }))
          }
          error={errors.titre}
        />

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((p) => ({ ...p, description: e.target.value }))
            }
            rows={5}
            className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Select
            label="Type d'action"
            required
            options={ACTION_TYPE_OPTIONS}
            value={formData.type}
            onChange={(e) =>
              setFormData((p) => ({ ...p, type: e.target.value }))
            }
          />
          <Select
            label='Priorité'
            options={PRIORITY_OPTIONS}
            value={formData.priorite}
            onChange={(e) =>
              setFormData((p) => ({ ...p, priorite: e.target.value }))
            }
          />
        </div>

        <div>
          <ResponsableSelector
            value={formData.responsableId}
            onChange={(userId) =>
              setFormData((p) => ({ ...p, responsableId: userId }))
            }
            label='Responsable'
            required
          />
          {errors.responsableId && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.responsableId}
            </p>
          )}
        </div>

        <DatePicker
          label='Échéance'
          required
          value={formData.echeance}
          onChange={(v) => setFormData((p) => ({ ...p, echeance: v }))}
          error={errors.echeance}
        />

        <div className='flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Création...' : "Créer l'action"}
          </Button>
        </div>
      </form>
    </SidePanel>
  );
}
