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
  CreateRiskRequest,
  Domaine,
  EnvironmentalSituation,
  RiskCategory,
  RiskType,
} from '../types';

const DOMAINE_OPTIONS: { value: Domaine; label: string }[] = [
  { value: 'SECURITE', label: 'Sécurité (SST)' },
  { value: 'ENVIRONNEMENT', label: 'Environnement' },
  { value: 'QUALITE', label: 'Qualité' },
];

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
  onSubmit: (data: CreateRiskRequest) => void;
  isPending: boolean;
}

export default function RiskFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: Props) {
  const [domaine, setDomaine] = useState<Domaine>('SECURITE');
  const [code, setCode] = useState('');
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

  const processOptions = processMap
    ? [...processMap.management, ...processMap.realisation, ...processMap.support]
        .map((process) => ({
          value: process.id,
          label: `${process.codification} - ${process.nom}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'fr'))
    : [];

  const workUnitOptions =
    workUnits
      ?.map((workUnit) => ({
        value: workUnit.id,
        label: `${workUnit.code} - ${workUnit.name}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'fr')) ?? [];

  const riskCategoryOptions = RISK_CATEGORY_OPTIONS[domaine];
  const resolvedRiskType: RiskType =
    domaine === 'QUALITE'
      ? 'VULNERABILITE_PROCESSUS'
      : domaine === 'ENVIRONNEMENT'
        ? 'ASPECT_ENVIRONNEMENTAL'
        : 'DANGER';
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
    if (frequencyOptions.length === 0) {
      return;
    }

    setFrequency((prev) => {
      if (frequencyOptions.some((option) => Number(option.value) === prev)) {
        return prev;
      }

      return Number(frequencyOptions[0].value);
    });
  }, [frequencyOptions]);

  useEffect(() => {
    if (severityOptions.length === 0) {
      return;
    }

    setSeverity((prev) => {
      if (severityOptions.some((option) => Number(option.value) === prev)) {
        return prev;
      }

      return Number(severityOptions[0].value);
    });
  }, [severityOptions]);

  useEffect(() => {
    if (!isOpen) return;
    setCode('');
    setTitle('');
    setDescription('');
    setCauses('');
    setConsequences('');
    setFrequency(1);
    setSeverity(1);
    setRiskCategory(RISK_CATEGORY_OPTIONS.SECURITE[0].value);
    setProcessusId('');
    setWorkUnitId('');
    setEnvironmentalSituation('');
    setReviewDate('');
  }, [isOpen]);

  useEffect(() => {
    setRiskCategory(RISK_CATEGORY_OPTIONS[domaine][0].value);
    setProcessusId('');
    setWorkUnitId('');
  }, [domaine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      code,
      title,
      description: description || undefined,
      domaine,
      riskType: resolvedRiskType,
      riskCategory,
      processusId: domaine === 'QUALITE' ? processusId || undefined : undefined,
      workUnitId: domaine !== 'QUALITE' ? workUnitId || undefined : undefined,
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
      title='Identifier un nouveau risque'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Select
          label='Spécificité'
          required
          options={DOMAINE_OPTIONS}
          value={domaine}
          onChange={(e) => setDomaine(e.target.value as Domaine)}
        />

        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Code'
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='RSK-SST-001'
          />
          <Input
            label='Nom du risque'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Chute de hauteur'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Categorie du risque'
            required
            options={riskCategoryOptions}
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
            label='Fréquence'
            options={frequencyOptions}
            value={String(frequency)}
            onChange={(e) => setFrequency(Number(e.target.value))}
          />
          <Select
            label='Gravité'
            options={severityOptions}
            value={String(severity)}
            onChange={(e) => setSeverity(Number(e.target.value))}
          />
        </div>

        {/* Champs conditionnels par domaine */}
        {domaine === 'QUALITE' ? (
          <Select
            label='Processus'
            placeholder='Sélectionner un processus'
            clearable
            options={processOptions}
            value={processusId}
            onChange={(e) => setProcessusId(e.target.value)}
          />
        ) : (
          <Select
            label='Unité de travail'
            placeholder='Sélectionner une unité de travail'
            clearable
            options={workUnitOptions}
            value={workUnitId}
            onChange={(e) => setWorkUnitId(e.target.value)}
          />
        )}

        {domaine === 'ENVIRONNEMENT' && (
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

        {domaine === 'QUALITE' && (
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
            {isPending ? 'Création...' : 'Créer le risque'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
