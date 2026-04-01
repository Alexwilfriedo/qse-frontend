import { Button, Card, PageHeader, Select, Textarea } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { useProcessMap } from '@/features/cartography/hooks/useProcessMap';
import { useReferenceItems } from '@/features/configuration/hooks';
import { showToast } from '@/lib/toast';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOpportunity, useRisks, useUpdateOpportunity } from './hooks/useRisks';
import type { OpportunityDecision, UpdateOpportunityRequest } from './types';

const DECISION_OPTIONS: { value: OpportunityDecision; label: string }[] = [
  { value: 'RETENUE', label: 'Retenue' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'REJETEE', label: 'Rejetée' },
];

function parseScoreRange(code: string): { min: number; max: number } | null {
  const [minRaw, maxRaw] = code.split('_');
  const min = Number(minRaw);
  const max = Number(maxRaw);

  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    return null;
  }

  return { min, max };
}

export default function OpportunityDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: opportunity, isLoading } = useOpportunity(id);
  const updateMutation = useUpdateOpportunity();
  const { data: users } = useUsers();
  const { data: processMap } = useProcessMap();
  const { data: risksPage } = useRisks({ page: 0, size: 200 });
  const { data: typeItems } = useReferenceItems('opportunity-types', true);
  const { data: originItems } = useReferenceItems('opportunity-origins', true);
  const { data: feasibilityItems } = useReferenceItems('opportunity-feasibility-levels', true);
  const { data: benefitItems } = useReferenceItems('opportunity-benefit-levels', true);
  const { data: scoreLevels } = useReferenceItems('opportunity-score-levels', true);

  const [form, setForm] = useState<UpdateOpportunityRequest | null>(null);
  const [riskToAdd, setRiskToAdd] = useState('');

  useEffect(() => {
    if (!opportunity) return;
    setForm({
      title: opportunity.title,
      opportunityTypeCode: opportunity.opportunityTypeCode ?? '',
      originCode: opportunity.originCode ?? '',
      processusId: opportunity.processusId ?? undefined,
      feasibilityScore: opportunity.feasibilityScore,
      benefitScore: opportunity.benefitScore,
      decision: opportunity.decision ?? 'EN_ATTENTE',
      necessaryActions: opportunity.necessaryActions ?? '',
      estimatedBudget: opportunity.estimatedBudget ?? '',
      responsibleUserId: opportunity.responsibleUserId ?? undefined,
      dueDate: opportunity.dueDate ?? undefined,
      obtainedResults: opportunity.obtainedResults ?? '',
      successIndicator: opportunity.successIndicator ?? '',
      associatedRiskIds: opportunity.associatedRiskIds ?? [],
      status: opportunity.status,
    });
  }, [opportunity]);

  const processOptions = useMemo(
    () => [
      { value: '', label: 'Sélectionner un processus' },
      ...[
        ...(processMap?.management ?? []),
        ...(processMap?.realisation ?? []),
        ...(processMap?.support ?? []),
      ]
        .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
        .map((process) => ({ value: process.id, label: process.nom })),
    ],
    [processMap],
  );

  const riskOptions = useMemo(
    () => [
      { value: '', label: 'Sélectionner un risque' },
      ...(risksPage?.content ?? []).map((risk) => ({
        value: risk.id,
        label: `${risk.code} - ${risk.title}`,
      })),
    ],
    [risksPage],
  );

  const userOptions = useMemo(
    () => [
      { value: '', label: 'Sélectionner un responsable' },
      ...(users ?? []).map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      })),
    ],
    [users],
  );

  const typeOptions = [
    { value: '', label: "Sélectionner un type d'opportunité" },
    ...(typeItems ?? []).map((item) => ({ value: item.code, label: item.label })),
  ];

  const originOptions = [
    { value: '', label: 'Sélectionner une origine' },
    ...(originItems ?? []).map((item) => ({ value: item.code, label: item.label })),
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

  const selectedRisks = (risksPage?.content ?? []).filter((risk) =>
    form?.associatedRiskIds?.includes(risk.id),
  );
  const score =
    (form?.feasibilityScore ?? 0) * (form?.benefitScore ?? 0);
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

  const handleSave = async () => {
    if (!form || !id) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          ...form,
          processusId: form.processusId || undefined,
          responsibleUserId: form.responsibleUserId || undefined,
          dueDate: form.dueDate || undefined,
          necessaryActions: form.necessaryActions?.trim() || undefined,
          estimatedBudget: form.estimatedBudget?.trim() || undefined,
          obtainedResults: form.obtainedResults?.trim() || undefined,
          successIndicator: form.successIndicator?.trim() || undefined,
        },
      });
      showToast.success('Opportunité mise à jour');
    } catch {
      showToast.error("Erreur lors de l'enregistrement");
    }
  };

  if (isLoading || !form || !opportunity) {
    return <div className='text-sm text-gray-500'>Chargement...</div>;
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={opportunity.title}
        description="Détail de l'opportunité"
        actions={
          <div className='flex gap-2'>
            <Button variant='secondary' onClick={() => navigate('/risks/opportunities')}>
              Retour
            </Button>
            <Button onClick={handleSave} isLoading={updateMutation.isPending}>
              Enregistrer
            </Button>
          </div>
        }
      />

      <Card>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          <Select
            label="Type d'opportunité"
            value={form.opportunityTypeCode}
            onChange={(e) => setForm((prev) => prev ? { ...prev, opportunityTypeCode: e.target.value } : prev)}
            options={typeOptions}
          />
          <Select
            label='Origine'
            value={form.originCode}
            onChange={(e) => setForm((prev) => prev ? { ...prev, originCode: e.target.value } : prev)}
            options={originOptions}
          />
          <Select
            label='Processus lié'
            value={form.processusId ?? ''}
            onChange={(e) => setForm((prev) => prev ? { ...prev, processusId: e.target.value || undefined } : prev)}
            options={processOptions}
            searchable
          />
          <Select
            label='Faisabilité'
            value={String(form.feasibilityScore)}
            onChange={(e) => setForm((prev) => prev ? { ...prev, feasibilityScore: Number(e.target.value) || 1 } : prev)}
            options={feasibilityOptions}
          />
          <Select
            label='Bénéfice'
            value={String(form.benefitScore)}
            onChange={(e) => setForm((prev) => prev ? { ...prev, benefitScore: Number(e.target.value) || 1 } : prev)}
            options={benefitOptions}
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
        </div>
      </Card>

      <Card>
        <h2 className='mb-4 text-lg font-semibold text-gray-900'>Évaluation des risques associés</h2>
        <div className='flex gap-3'>
          <div className='flex-1'>
            <Select
              label='Ajouter un risque existant'
              value={riskToAdd}
              onChange={(e) => setRiskToAdd(e.target.value)}
              options={riskOptions}
              searchable
            />
          </div>
          <div className='pt-7'>
            <Button
              type='button'
              onClick={() => {
                if (!riskToAdd || form.associatedRiskIds?.includes(riskToAdd)) {
                  return;
                }
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        associatedRiskIds: [...(prev.associatedRiskIds ?? []), riskToAdd],
                      }
                    : prev,
                );
                setRiskToAdd('');
              }}>
              Ajouter
            </Button>
          </div>
        </div>

        <div className='mt-4 space-y-2'>
          {selectedRisks.length === 0 && (
            <div className='text-sm text-gray-500'>Aucun risque associé.</div>
          )}
          {selectedRisks.map((risk) => (
            <div
              key={risk.id}
              className='flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3'>
              <div>
                <div className='font-medium text-gray-900'>{risk.title}</div>
                <div className='text-sm text-gray-500'>{risk.code}</div>
              </div>
              <Button
                type='button'
                variant='ghost'
                onClick={() =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          associatedRiskIds: (prev.associatedRiskIds ?? []).filter(
                            (riskId) => riskId !== risk.id,
                          ),
                        }
                      : prev,
                  )
                }>
                Retirer
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className='mb-4 text-lg font-semibold text-gray-900'>Plan d&apos;action et ressources</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <Select
            label='Décision'
            value={form.decision ?? 'EN_ATTENTE'}
            onChange={(e) =>
              setForm((prev) =>
                prev ? { ...prev, decision: e.target.value as OpportunityDecision } : prev,
              )
            }
            options={DECISION_OPTIONS}
          />
          <Select
            label='Responsable'
            value={form.responsibleUserId ?? ''}
            onChange={(e) =>
              setForm((prev) =>
                prev ? { ...prev, responsibleUserId: e.target.value || undefined } : prev,
              )
            }
            options={userOptions}
            searchable
          />
          <div className='md:col-span-2'>
            <Textarea
              label='Actions nécessaires'
              value={form.necessaryActions ?? ''}
              onChange={(e) =>
                setForm((prev) => prev ? { ...prev, necessaryActions: e.target.value } : prev)
              }
              rows={4}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Budget estimé</label>
            <input
              type='text'
              value={form.estimatedBudget ?? ''}
              onChange={(e) =>
                setForm((prev) => prev ? { ...prev, estimatedBudget: e.target.value } : prev)
              }
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
              placeholder='Investissement nécessaire Capex / Opex'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Échéance</label>
            <input
              type='date'
              value={form.dueDate ?? ''}
              onChange={(e) =>
                setForm((prev) => prev ? { ...prev, dueDate: e.target.value || undefined } : prev)
              }
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className='mb-4 text-lg font-semibold text-gray-900'>Mesurer l&apos;efficacité (Clôture)</h2>
        <div className='grid gap-4'>
          <Textarea
            label='Résultats obtenus'
            value={form.obtainedResults ?? ''}
            onChange={(e) =>
              setForm((prev) => prev ? { ...prev, obtainedResults: e.target.value } : prev)
            }
            rows={4}
            placeholder="Est-ce que l'opportunité a généré le gain prévu ?"
          />
          <Textarea
            label='Indicateur de succès'
            value={form.successIndicator ?? ''}
            onChange={(e) =>
              setForm((prev) => prev ? { ...prev, successIndicator: e.target.value } : prev)
            }
            rows={3}
          />
        </div>
      </Card>
    </div>
  );
}
