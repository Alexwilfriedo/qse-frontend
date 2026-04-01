import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Textarea,
} from '@/components/ui';
import { useProcessMap, useWorkUnits } from '@/features/cartography/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useCriticalityMatrix, useRiskScale } from '../hooks/useRiskConfig';
import type {
  Domaine,
  EnvironmentalSituation,
  Risk,
  RiskCategory,
  UpdateRiskRequest,
} from '../types';

const RISK_CATEGORY_OPTIONS: Record<
  Domaine,
  { value: RiskCategory; label: string }[]
> = {
  QUALITE: [
    { value: 'STRATEGIQUE', label: 'Strategique' },
    { value: 'OPERATIONNEL', label: 'Operationnel' },
    { value: 'FINANCIER', label: 'Financier' },
    { value: 'JURIDIQUE', label: 'Juridique' },
    { value: 'TECHNOLOGIQUE', label: 'Technologique' },
  ],
  SECURITE: [
    { value: 'PHYSIQUE', label: 'Physique' },
    { value: 'PSYCHOSOCIAUX', label: 'Psychosociaux' },
  ],
  ENVIRONNEMENT: [
    { value: 'CATASTROPHES_NATURELLES', label: 'Catastrophes naturelles' },
    { value: 'CHIMIQUES', label: 'Chimiques' },
    { value: 'BIOLOGIQUE', label: 'Biologique' },
  ],
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  risk: Risk;
  onSubmit: (data: UpdateRiskRequest) => void;
  isPending: boolean;
}

export default function RiskEditModal({
  isOpen,
  onClose,
  risk,
  onSubmit,
  isPending,
}: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [causes, setCauses] = useState('');
  const [consequences, setConsequences] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [severity, setSeverity] = useState(1);
  const [riskCategory, setRiskCategory] = useState<RiskCategory>('PHYSIQUE');
  const [processusId, setProcessusId] = useState('');
  const [workUnitId, setWorkUnitId] = useState('');
  const [environmentalSituation, setEnvironmentalSituation] = useState<
    EnvironmentalSituation | ''
  >('');
  const [reviewDate, setReviewDate] = useState('');

  const { data: frequencyScale } = useRiskScale('FREQUENCY');
  const { data: severityScale } = useRiskScale('SEVERITY');
  const { data: criticalityThresholds } = useCriticalityMatrix();
  const { data: workUnits } = useWorkUnits();
  const { data: processMap } = useProcessMap();

  const frequencyOptions = useMemo(
    () =>
      frequencyScale?.levels.map((level) => ({
        value: String(level.value),
        label: level.label,
      })) ?? [],
    [frequencyScale],
  );

  const severityOptions = useMemo(
    () =>
      severityScale?.levels.map((level) => ({
        value: String(level.value),
        label: level.label,
      })) ?? [],
    [severityScale],
  );

  const processOptions = useMemo(
    () =>
      processMap
        ? [...processMap.management, ...processMap.realisation, ...processMap.support]
            .map((process) => ({
              value: process.id,
              label: `${process.codification} - ${process.nom}`,
            }))
            .sort((a, b) => a.label.localeCompare(b.label, 'fr'))
        : [],
    [processMap],
  );

  const workUnitOptions = useMemo(
    () =>
      workUnits
        ?.map((workUnit) => ({
          value: workUnit.id,
          label: `${workUnit.code} - ${workUnit.name}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'fr')) ?? [],
    [workUnits],
  );
  const bruteCriticityScore = frequency * severity;
  const matchedCriticality = useMemo(
    () =>
      criticalityThresholds?.find(
        (threshold) =>
          bruteCriticityScore >= threshold.minValue &&
          bruteCriticityScore <= threshold.maxValue,
      ) ?? null,
    [bruteCriticityScore, criticalityThresholds],
  );

  useEffect(() => {
    if (!isOpen) return;
    setTitle(risk.title);
    setDescription(risk.description ?? '');
    setCauses(risk.causes ?? '');
    setConsequences(risk.consequences ?? '');
    setFrequency(risk.frequency);
    setSeverity(risk.severity);
    setRiskCategory(
      risk.riskCategory ?? RISK_CATEGORY_OPTIONS[risk.domaine][0].value,
    );
    setProcessusId(risk.processusId ?? '');
    setWorkUnitId(risk.workUnitId ?? '');
    setEnvironmentalSituation(risk.environmentalSituation ?? '');
    setReviewDate(risk.reviewDate ?? '');
  }, [isOpen, risk]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      riskCategory,
      processusId: risk.domaine === 'QUALITE' ? processusId || undefined : undefined,
      workUnitId: risk.domaine !== 'QUALITE' ? workUnitId || undefined : undefined,
      causes: causes || undefined,
      consequences: consequences || undefined,
      frequency,
      severity,
      environmentalSituation: environmentalSituation || undefined,
      reviewDate: reviewDate || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Modifier ${risk.code}`}
      preserveState>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Titre'
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Categorie du risque'
            options={RISK_CATEGORY_OPTIONS[risk.domaine]}
            value={riskCategory}
            onChange={(e) => setRiskCategory(e.target.value as RiskCategory)}
          />
          <Input
            label='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Textarea
            label='Causes'
            value={causes}
            onChange={(e) => setCauses(e.target.value)}
            rows={3}
            placeholder='Décrire les causes du risque'
          />
          <Textarea
            label='Conséquences'
            value={consequences}
            onChange={(e) => setConsequences(e.target.value)}
            rows={3}
            placeholder='Décrire les conséquences potentielles'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Frequence'
            options={frequencyOptions}
            value={String(frequency)}
            onChange={(e) => setFrequency(Number(e.target.value))}
          />
          <Select
            label='Gravite'
            options={severityOptions}
            value={String(severity)}
            onChange={(e) => setSeverity(Number(e.target.value))}
          />
        </div>

        {risk.domaine === 'QUALITE' ? (
          <Select
            label='Processus'
            placeholder='Selectionner un processus'
            clearable
            options={processOptions}
            value={processusId}
            onChange={(e) => setProcessusId(e.target.value)}
          />
        ) : (
          <Select
            label='Unite de travail'
            placeholder='Selectionner une unite de travail'
            clearable
            options={workUnitOptions}
            value={workUnitId}
            onChange={(e) => setWorkUnitId(e.target.value)}
          />
        )}

        {risk.domaine === 'ENVIRONNEMENT' && (
          <Select
            label='Situation'
            placeholder='Non specifiee'
            clearable
            options={[
              { value: 'NORMALE', label: 'Normale' },
              { value: 'ACCIDENTELLE', label: 'Accidentelle' },
            ]}
            value={environmentalSituation}
            onChange={(e) =>
              setEnvironmentalSituation(
                e.target.value as EnvironmentalSituation | '',
              )
            }
          />
        )}

        {risk.domaine === 'QUALITE' && (
          <DatePicker
            label="Date d'examen"
            value={reviewDate}
            onChange={setReviewDate}
            clearable
          />
        )}

        <div
          className='rounded-xl border px-4 py-4 shadow-sm'
          style={{
            backgroundColor: matchedCriticality
              ? `${matchedCriticality.color}18`
              : '#F3F4F6',
            borderColor: matchedCriticality?.color ?? '#D1D5DB',
          }}>
          <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
            Criticité brute
          </div>
          <div className='mt-2 flex items-center justify-between gap-4'>
            <div className='flex items-end gap-2'>
              <span
                className='text-3xl font-bold'
                style={{ color: matchedCriticality?.color ?? '#111827' }}>
                {bruteCriticityScore}
              </span>
              <span className='pb-1 text-sm text-gray-500'>
                = {frequency} × {severity}
              </span>
            </div>
            <span
              className='rounded-full px-3 py-1 text-sm font-semibold'
              style={{
                backgroundColor: matchedCriticality?.color ?? '#9CA3AF',
                color: '#FFFFFF',
              }}>
              {matchedCriticality?.label ?? 'Non classée'}
            </span>
          </div>
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Mise a jour...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
