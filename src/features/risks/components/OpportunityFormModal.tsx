import { Button, Input, Modal, Select } from '@/components/ui';
import { useProcessMap } from '@/features/cartography/hooks/useProcessMap';
import type { ProcessView } from '@/features/cartography/processTypes';
import { useReferenceItems } from '@/features/configuration/hooks';
import { useEffect, useMemo, useState } from 'react';
import type { CreateOpportunityRequest, Domaine } from '../types';

interface OpportunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOpportunityRequest) => Promise<void>;
  isPending?: boolean;
}

const DOMAINE_OPTIONS: { value: Domaine; label: string }[] = [
  { value: 'QUALITE', label: 'Qualité' },
  { value: 'SECURITE', label: 'Sécurité' },
  { value: 'ENVIRONNEMENT', label: 'Environnement' },
];

const INITIAL_FORM: CreateOpportunityRequest = {
  title: '',
  domaine: 'QUALITE',
  opportunityTypeCode: '',
  originCode: '',
  processusId: '',
  feasibilityScore: 1,
  benefitScore: 1,
};

function parseScoreRange(code: string): { min: number; max: number } | null {
  const [minRaw, maxRaw] = code.split('_');
  const min = Number(minRaw);
  const max = Number(maxRaw);

  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    return null;
  }

  return { min, max };
}

export default function OpportunityFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
}: OpportunityFormModalProps) {
  const [form, setForm] = useState<CreateOpportunityRequest>(INITIAL_FORM);
  const { data: processMap } = useProcessMap();
  const { data: originItems } = useReferenceItems('opportunity-origins', true);
  const { data: typeItems } = useReferenceItems('opportunity-types', true);
  const { data: feasibilityItems } = useReferenceItems(
    'opportunity-feasibility-levels',
    true,
  );
  const { data: benefitItems } = useReferenceItems(
    'opportunity-benefit-levels',
    true,
  );
  const { data: scoreLevels } = useReferenceItems(
    'opportunity-score-levels',
    true,
  );

  const processOptions = [
    { value: '', label: 'Sélectionner un processus' },
    ...[
      ...(processMap?.management ?? []),
      ...(processMap?.realisation ?? []),
      ...(processMap?.support ?? []),
    ]
      .sort((a: ProcessView, b: ProcessView) => a.nom.localeCompare(b.nom, 'fr'))
      .map((process) => ({
        value: process.id,
        label: process.nom,
      })),
  ];

  const typeOptions = [
    { value: '', label: "Sélectionner un type d'opportunité" },
    ...(typeItems ?? []).map((item) => ({
      value: item.code,
      label: item.label,
    })),
  ];

  const originOptions = [
    { value: '', label: 'Sélectionner une origine' },
    ...(originItems ?? []).map((item) => ({
      value: item.code,
      label: item.label,
    })),
  ];

  const feasibilityOptions = [
    { value: '', label: 'Sélectionner une faisabilité' },
    ...(feasibilityItems ?? []).map((item) => ({
      value: item.code,
      label: `${item.code} - ${item.label}`,
    })),
  ];

  const benefitOptions = [
    { value: '', label: 'Sélectionner un bénéfice' },
    ...(benefitItems ?? []).map((item) => ({
      value: item.code,
      label: `${item.code} - ${item.label}`,
    })),
  ];

  const score = form.feasibilityScore * form.benefitScore;
  const matchedScoreLevel = useMemo(
    () =>
      (scoreLevels ?? [])
        .map((item) => {
          const range = parseScoreRange(item.code);
          if (!range) {
            return null;
          }

          return {
            ...item,
            min: range.min,
            max: range.max,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .find((item) => score >= item.min && score <= item.max) ?? null,
    [score, scoreLevels],
  );

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      processusId: form.processusId || undefined,
      feasibilityScore: Number(form.feasibilityScore),
      benefitScore: Number(form.benefitScore),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Nouvelle opportunité'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label="Libellé de l'opportunité"
          value={form.title}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, title: event.target.value }))
          }
          required
        />

        <Select
          label='Spécificité'
          value={form.domaine}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              domaine: event.target.value as Domaine,
            }))
          }
          options={DOMAINE_OPTIONS}
          required
        />

        <Select
          label="Type d'opportunité"
          value={form.opportunityTypeCode}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              opportunityTypeCode: event.target.value,
            }))
          }
          options={typeOptions}
          searchable
          required
        />

        <Select
          label='Origine'
          value={form.originCode}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, originCode: event.target.value }))
          }
          options={originOptions}
          searchable
          required
        />

        <Select
          label='Processus lié'
          value={form.processusId}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, processusId: event.target.value }))
          }
          options={processOptions}
          searchable
          required
        />

        <Select
          label='Faisabilité'
          value={String(form.feasibilityScore)}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              feasibilityScore: Number(event.target.value) || 1,
            }))
          }
          options={feasibilityOptions}
          required
        />

        <Select
          label='Bénéfice'
          value={String(form.benefitScore)}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              benefitScore: Number(event.target.value) || 1,
            }))
          }
          options={benefitOptions}
          required
        />

        <div
          className='rounded-xl border px-4 py-4 shadow-sm'
          style={{
            backgroundColor: matchedScoreLevel
              ? `${matchedScoreLevel.color ?? '#D1D5DB'}18`
              : '#F3F4F6',
            borderColor: matchedScoreLevel?.color ?? '#D1D5DB',
          }}>
          <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
            Score
          </div>
          <div className='mt-2 flex items-center justify-between gap-4'>
            <div className='flex items-end gap-2'>
              <span
                className='text-3xl font-bold'
                style={{ color: matchedScoreLevel?.color ?? '#111827' }}>
                {score}
              </span>
              <span className='pb-1 text-sm text-gray-500'>
                = {form.feasibilityScore} × {form.benefitScore}
              </span>
            </div>
            <span
              className='rounded-full px-3 py-1 text-sm font-semibold'
              style={{
                backgroundColor: matchedScoreLevel?.color ?? '#9CA3AF',
                color: '#FFFFFF',
              }}>
              {matchedScoreLevel?.label ?? 'Non classé'}
            </span>
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' isLoading={isPending}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
