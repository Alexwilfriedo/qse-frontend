import {
  Button,
  Card,
  CardHeader,
  DomainBadge,
  PageHeader,
  SkeletonCard,
} from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RiskDocumentLinksPanel from './components/RiskDocumentLinksPanel';
import RiskEditModal from './components/RiskEditModal';
import RiskMeasuresPanel from './components/RiskMeasuresPanel';
import { useCriticalityMatrix } from './hooks';
import {
  useDeleteRisk,
  useEvaluateResidual,
  useRisk,
  useUpdateRisk,
} from './hooks/useRisks';
import type {
  CriticalityLevel,
  Domaine,
  Risk,
  UpdateRiskRequest,
} from './types';

const RISK_CATEGORY_LABEL: Record<string, string> = {
  STRATEGIQUE: 'Strategique',
  OPERATIONNEL: 'Operationnel',
  FINANCIER: 'Financier',
  JURIDIQUE: 'Juridique',
  TECHNOLOGIQUE: 'Technologique',
  PHYSIQUE: 'Physique',
  PSYCHOSOCIAUX: 'Psychosociaux',
  CATASTROPHES_NATURELLES: 'Catastrophes naturelles',
  CHIMIQUES: 'Chimiques',
  BIOLOGIQUE: 'Biologique',
};

const DOMAINE_KEY: Record<Domaine, 'qualite' | 'securite' | 'environnement'> = {
  QUALITE: 'qualite',
  SECURITE: 'securite',
  ENVIRONNEMENT: 'environnement',
};

const CRITICALITY_LEVEL_LABEL: Record<string, string> = {
  FAIBLE: 'Faible',
  MOYEN: 'Moyen',
  ELEVE: 'Élevé',
};

export default function RiskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { data: risk, isLoading, isError } = useRisk(id ?? '');
  const updateMutation = useUpdateRisk();
  const deleteMutation = useDeleteRisk();

  const handleUpdate = async (data: UpdateRiskRequest) => {
    try {
      await updateMutation.mutateAsync({ id: id!, data });
      showToast.success('Risque mis à jour');
      setEditOpen(false);
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id!);
      showToast.success('Risque supprimé');
      navigate('/risks');
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError || !risk) {
    return (
      <div className='rounded border border-gray-200 p-6 text-center dark:border-gray-700'>
        <p className='mb-4 text-error-600'>Risque introuvable</p>
        <button
          onClick={() => navigate('/risks')}
          className='text-brand-600 hover:underline'>
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={risk.title}
        description={`${risk.code} — Identifié le ${new Date(risk.createdAt).toLocaleDateString('fr-FR')}`}
        actions={
          <div className='flex gap-2'>
            <Button variant='secondary' onClick={() => navigate('/risks')}>
              <ArrowLeft className='mr-1 h-4 w-4' />
              Retour
            </Button>
            <Button variant='secondary' onClick={() => setEditOpen(true)}>
              <Pencil className='mr-1 h-4 w-4' />
              Modifier
            </Button>
            <Button
              variant='destructive'
              onClick={() => setDeleteConfirm(true)}>
              <Trash2 className='mr-1 h-4 w-4' />
              Supprimer
            </Button>
          </div>
        }
      />

      {/* Informations principales */}
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-6'>
          <RiskInfoCard risk={risk} />
          <RiskCausesConsequencesCard risk={risk} />
          <RiskDocumentLinksPanel riskId={risk.id} />
          <RiskMeasuresPanel riskId={risk.id} />
        </div>
        <div className='space-y-6'>
          <RiskEvaluationCard risk={risk} />
        </div>
      </div>

      {/* Modals */}
      <RiskEditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        risk={risk}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
      />

      {deleteConfirm && (
        <DeleteConfirmDialog
          risk={risk}
          onCancel={() => setDeleteConfirm(false)}
          onConfirm={handleDelete}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

// ========== Sub-components ==========

function RiskInfoCard({ risk }: { risk: Risk }) {
  return (
    <Card>
      <CardHeader title='Informations générales' />
      <div className='space-y-3 p-4 pt-0'>
        <div className='grid grid-cols-2 gap-4'>
          <InfoField label='Code' value={risk.code} mono />
          <InfoField label='Domaine'>
            <DomainBadge domain={DOMAINE_KEY[risk.domaine]} size='md' />
          </InfoField>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <InfoField
            label='Categorie du risque'
            value={
              RISK_CATEGORY_LABEL[risk.riskCategory ?? ''] ??
              risk.riskCategory ??
              '—'
            }
          />
          <InfoField
            label='Dernière modification'
            value={
              risk.updatedAt
                ? new Date(risk.updatedAt).toLocaleDateString('fr-FR')
                : '—'
            }
          />
        </div>
        {risk.description && (
          <InfoField label='Description' value={risk.description} />
        )}
      </div>
    </Card>
  );
}

function RiskCausesConsequencesCard({ risk }: { risk: Risk }) {
  if (!risk.causes && !risk.consequences) return null;

  return (
    <Card>
      <CardHeader title='Causes & Conséquences' />
      <div className='space-y-3 p-4 pt-0'>
        {risk.causes && <InfoField label='Causes' value={risk.causes} />}
        {risk.consequences && (
          <InfoField label='Conséquences' value={risk.consequences} />
        )}
      </div>
    </Card>
  );
}

function CriticalityBlock({
  label,
  frequency,
  severity,
  score,
  level,
  color,
}: {
  label: string;
  frequency: number;
  severity: number;
  score: number;
  level: CriticalityLevel | null;
  color: string | null;
}) {
  const bgColor = color ?? '#9CA3AF';
  return (
    <div className='space-y-2'>
      <h4 className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
        {label}
      </h4>
      <div className='flex items-center gap-3'>
        <span
          className='inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white'
          style={{ backgroundColor: bgColor }}>
          {score}
        </span>
        <div>
          {level && (
            <span
              className='rounded-full px-2 py-0.5 text-xs font-semibold text-white'
              style={{ backgroundColor: bgColor }}>
              {CRITICALITY_LEVEL_LABEL[level] ?? level}
            </span>
          )}
          <p className='mt-0.5 text-xs text-gray-400'>
            F ({frequency}) × G ({severity})
          </p>
        </div>
      </div>
    </div>
  );
}

function RiskEvaluationCard({ risk }: { risk: Risk }) {
  const evaluateResidual = useEvaluateResidual(risk.id);
  const { data: thresholds } = useCriticalityMatrix();
  const [editing, setEditing] = useState(false);
  const [resF, setResF] = useState(risk.residualFrequency ?? risk.frequency);
  const [resG, setResG] = useState(risk.residualSeverity ?? risk.severity);

  const hasResidual =
    risk.residualFrequency != null && risk.residualSeverity != null;

  const resolveLevel = (score: number): CriticalityLevel | null => {
    const match = thresholds?.find(
      (t) => score >= t.minValue && score <= t.maxValue,
    );
    return match?.level ?? null;
  };

  const handleSubmit = async () => {
    try {
      await evaluateResidual.mutateAsync({
        residualFrequency: resF,
        residualSeverity: resG,
      });
      const residualScore = resF * resG;
      const residualLevel = resolveLevel(residualScore);
      if (residualLevel === 'ELEVE') {
        showToast.info(
          'Criticité résiduelle toujours élevée — une action d\u2019amélioration a été générée automatiquement.',
        );
      } else {
        showToast.success('Criticité résiduelle enregistrée');
      }
      setEditing(false);
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader title='Évaluation' />
      <div className='space-y-4 p-4 pt-0'>
        <CriticalityBlock
          label='Criticité brute'
          frequency={risk.frequency}
          severity={risk.severity}
          score={risk.criticityScore}
          level={risk.criticalityLevel}
          color={risk.criticalityColor}
        />

        <hr className='border-gray-200 dark:border-gray-700' />

        {hasResidual && !editing ? (
          <>
            <CriticalityBlock
              label='Criticité résiduelle'
              frequency={risk.residualFrequency!}
              severity={risk.residualSeverity!}
              score={risk.residualCriticityScore}
              level={risk.residualCriticalityLevel}
              color={risk.residualCriticalityColor}
            />
            {risk.residualCriticityScore < risk.criticityScore && (
              <div className='inline-flex items-center gap-2 rounded-full border border-success-200 bg-success-50 px-3 py-1.5 text-sm font-semibold text-success-700'>
                <span className='text-base leading-none'>↓</span>
                <span>
                  Réduction de {risk.criticityScore - risk.residualCriticityScore}{' '}
                  points
                </span>
              </div>
            )}
            {risk.residualCriticityScore > risk.criticityScore && (
              <div className='inline-flex items-center gap-2 rounded-full border border-error-200 bg-error-50 px-3 py-1.5 text-sm font-semibold text-error-700'>
                <span className='text-base leading-none'>↑</span>
                <span>
                  Augmentation de {risk.residualCriticityScore - risk.criticityScore}{' '}
                  points
                </span>
              </div>
            )}
            <Button
              size='sm'
              variant='secondary'
              onClick={() => setEditing(true)}>
              Réévaluer
            </Button>
          </>
        ) : editing || !hasResidual ? (
          <div className='space-y-3'>
            <h4 className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
              {hasResidual
                ? 'Réévaluation résiduelle'
                : 'Évaluation résiduelle'}
            </h4>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className='mb-1 block text-xs text-gray-500'>
                  Fréquence résid.
                </label>
                <input
                  type='number'
                  min={1}
                  value={resF}
                  onChange={(e) => setResF(Number(e.target.value))}
                  className='w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700'
                />
              </div>
              <div>
                <label className='mb-1 block text-xs text-gray-500'>
                  Gravité résid.
                </label>
                <input
                  type='number'
                  min={1}
                  value={resG}
                  onChange={(e) => setResG(Number(e.target.value))}
                  className='w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700'
                />
              </div>
            </div>
            <p className='text-xs text-gray-400'>
              Score prévisionnel : {resF * resG}
            </p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                onClick={handleSubmit}
                disabled={evaluateResidual.isPending || resF < 1 || resG < 1}>
                {evaluateResidual.isPending ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
              {editing && (
                <Button
                  size='sm'
                  variant='secondary'
                  onClick={() => setEditing(false)}>
                  Annuler
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function DeleteConfirmDialog({
  risk,
  onCancel,
  onConfirm,
  isPending,
}: {
  risk: Risk;
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
          Supprimer le risque
        </h3>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          Êtes-vous sûr de vouloir supprimer le risque{' '}
          <strong>{risk.code}</strong> ? Cette action est irréversible.
        </p>
        <div className='mt-4 flex justify-end gap-2'>
          <Button variant='secondary' onClick={onCancel}>
            Annuler
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isPending}>
            {isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  mono,
  children,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <dt className='text-xs font-medium uppercase text-gray-500'>{label}</dt>
      <dd
        className={`mt-0.5 text-sm text-gray-900 dark:text-gray-100 ${mono ? 'font-mono' : ''}`}>
        {children ?? value ?? '—'}
      </dd>
    </div>
  );
}
