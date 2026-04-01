import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Textarea,
  type SelectOption,
} from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { useEntityTree, useProcessMap } from '@/features/cartography/hooks';
import { getEntityTypeLabel, type EntityTreeNode } from '@/features/cartography/types';
import { useWorkUnits } from '@/features/cartography/hooks/useWorkUnits';
import { useAuditors } from '../hooks/useAudits';
import { useEffect, useMemo, useState } from 'react';
import { AUDIT_PROGRAM_DOMAINS } from '../programConfig';
import type {
  AuditProgramExecutionStatus,
  AuditProgramPriority,
  AuditProgramScopeType,
  CreateCampaignRequest,
  Domaine,
} from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCampaignRequest) => void;
  isLoading: boolean;
  defaultAnnee: number;
  preset?: {
    domaine: Domaine;
    referentielNormatif: string;
    objectifGlobal: string;
  } | null;
}

interface ScopeOption extends SelectOption {
  scopeType: AuditProgramScopeType;
  scopeId: string;
  scopeLabel: string;
  managerUserIds: string[];
}

interface FormState {
  objectifsAudit: string;
  referentielNormatif: string;
  scopeValue: string;
  managerPilotUserId: string;
  cycleEvaluation: string;
  dateExecutionPrevisionnelle: string;
  responsableAuditId: string;
  auditeursInternesIds: string[];
  priorite: AuditProgramPriority | '';
  executionStatus: AuditProgramExecutionStatus | '';
  surveillanceControle: string;
}

const REFERENTIEL_OPTIONS = AUDIT_PROGRAM_DOMAINS.flatMap((item) =>
  item.normes.map((norme) => ({
    value: norme,
    label: norme,
    domaine: item.domaine,
  })),
);

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: 'HAUTE', label: 'Haute' },
  { value: 'MOYENNE', label: 'Moyenne' },
  { value: 'FAIBLE', label: 'Faible' },
];

const EXECUTION_STATUS_OPTIONS: SelectOption[] = [
  { value: 'PLANIFIE', label: 'Planifié' },
  { value: 'EN_EXECUTION', label: 'En exécution' },
  { value: 'EN_COURS_SUIVI', label: 'En cours de suivi' },
  { value: 'FINALISE', label: 'Finalisé' },
  { value: 'REPORTE', label: 'Reporté' },
];

const INITIAL_FORM: FormState = {
  objectifsAudit: '',
  referentielNormatif: '',
  scopeValue: '',
  managerPilotUserId: '',
  cycleEvaluation: '',
  dateExecutionPrevisionnelle: '',
  responsableAuditId: '',
  auditeursInternesIds: [],
  priorite: '',
  executionStatus: '',
  surveillanceControle: '',
};

function flattenEntityTree(nodes: EntityTreeNode[] | undefined): EntityTreeNode[] {
  if (!nodes) {
    return [];
  }

  return nodes.flatMap((node) => [node, ...flattenEntityTree(node.children)]);
}

function buildCampaignTitle(
  annee: number,
  referentiel: string,
  scopeLabel: string,
  cycleEvaluation: string,
) {
  return `Programme d'audit ${annee} - ${referentiel} - ${scopeLabel} - ${cycleEvaluation}`;
}

function getCampaignDates(dateExecutionPrevisionnelle: string, fallbackYear: number) {
  const year = dateExecutionPrevisionnelle
    ? Number(dateExecutionPrevisionnelle.slice(0, 4))
    : fallbackYear;

  return {
    annee: year,
    dateDebut: `${year}-01-01`,
    dateFin: `${year}-12-31`,
  };
}

export function CreateCampaignModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
  defaultAnnee,
  preset,
}: Props) {
  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    referentielNormatif: preset?.referentielNormatif ?? '',
  });
  const { data: users } = useUsers();
  const { data: processMap } = useProcessMap();
  const { data: entityTree } = useEntityTree();
  const { data: workUnits } = useWorkUnits();
  const { data: auditors } = useAuditors(true);

  const allProcesses = useMemo(
    () =>
      processMap
        ? [
            ...processMap.management,
            ...processMap.realisation,
            ...processMap.support,
          ]
        : [],
    [processMap],
  );

  const flatEntities = useMemo(() => flattenEntityTree(entityTree), [entityTree]);

  const sites = useMemo(
    () => flatEntities.filter((entity) => entity.type === 'SITE'),
    [flatEntities],
  );

  const scopeOptions = useMemo<ScopeOption[]>(() => {
    const processOptions = allProcesses.map((process) => ({
      value: `PROCESSUS:${process.id}`,
      label: `Processus · ${process.codification} - ${process.nom}`,
      description: 'Processus issu du module cartographie',
      scopeType: 'PROCESSUS' as const,
      scopeId: process.id,
      scopeLabel: `${process.codification} - ${process.nom}`,
      managerUserIds: [process.piloteId, process.managerId]
        .filter((id): id is string => id != null)
        .filter((value, index, array) => array.indexOf(value) === index),
    }));

    const siteOptions = sites.map((site) => ({
      value: `SITE:${site.id}`,
      label: `Site · ${site.nom}`,
      description: `Type: ${getEntityTypeLabel(site.type)}`,
      scopeType: 'SITE' as const,
      scopeId: site.id,
      scopeLabel: site.nom,
      managerUserIds: site.responsableIds,
    }));

    const workUnitOptions = (workUnits ?? []).map((workUnit) => {
      const linkedSite = sites.find((site) => site.nom === workUnit.location);
      return {
        value: `UNITE_TRAVAIL:${workUnit.id}`,
        label: `UT · ${workUnit.code} - ${workUnit.name}`,
        description: workUnit.location
          ? `Site: ${workUnit.location}`
          : 'Unité de travail',
        scopeType: 'UNITE_TRAVAIL' as const,
        scopeId: workUnit.id,
        scopeLabel: `${workUnit.code} - ${workUnit.name}`,
        managerUserIds: linkedSite?.responsableIds ?? [],
      };
    });

    if (preset?.domaine === 'QUALITE') {
      return processOptions;
    }

    if (preset?.domaine === 'SECURITE' || preset?.domaine === 'ENVIRONNEMENT') {
      return [...siteOptions, ...workUnitOptions];
    }

    return [...processOptions, ...siteOptions, ...workUnitOptions];
  }, [allProcesses, preset?.domaine, sites, workUnits]);

  const selectedScope = useMemo(
    () => scopeOptions.find((option) => option.value === form.scopeValue),
    [scopeOptions, form.scopeValue],
  );

  const managerPilotOptions = useMemo<SelectOption[]>(() => {
    if (!selectedScope || !users) {
      return [];
    }

    return selectedScope.managerUserIds
      .map((userId) => users.find((user) => user.id === userId))
      .filter(Boolean)
      .map((user) => ({
        value: user!.id,
        label: `${user!.firstName} ${user!.lastName}`,
        description: user!.email,
      }));
  }, [selectedScope, users]);

  const auditorOptions = useMemo<SelectOption[]>(() => {
    if (!auditors || !users) {
      return [];
    }

    return auditors.map((auditor) => {
      const user = users.find((item) => item.id === auditor.userId);
      return {
        value: auditor.id,
        label: user
          ? `${user.firstName} ${user.lastName}`
          : (auditor.nomComplet ?? `Auditeur ${auditor.id.slice(0, 8)}`),
        description: user?.email ?? auditor.level,
      };
    });
  }, [auditors, users]);

  const selectedReferentiel = REFERENTIEL_OPTIONS.find(
    (option) =>
      option.value === (preset?.referentielNormatif ?? form.referentielNormatif),
  );

  const canSubmit =
    (preset?.objectifGlobal?.trim() || form.objectifsAudit.trim()) &&
    (preset?.referentielNormatif || form.referentielNormatif) &&
    selectedScope &&
    form.managerPilotUserId &&
    form.cycleEvaluation.trim() &&
    form.dateExecutionPrevisionnelle &&
    form.responsableAuditId &&
    form.priorite &&
    form.executionStatus;

  const reset = () => {
    setForm({
      ...INITIAL_FORM,
      referentielNormatif: preset?.referentielNormatif ?? '',
    });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm({
      ...INITIAL_FORM,
      referentielNormatif: preset?.referentielNormatif ?? '',
    });
  }, [isOpen, preset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedScope || !selectedReferentiel) {
      return;
    }

    const { annee, dateDebut, dateFin } = getCampaignDates(
      form.dateExecutionPrevisionnelle,
      defaultAnnee,
    );

    onSave({
      annee,
      titre: buildCampaignTitle(
        annee,
        preset?.referentielNormatif ?? form.referentielNormatif,
        selectedScope.scopeLabel,
        form.cycleEvaluation.trim(),
      ),
      description: (preset?.objectifGlobal ?? form.objectifsAudit).trim(),
      dateDebut,
      dateFin,
      perimetre: [preset?.domaine ?? selectedReferentiel.domaine],
      objectifsAudit: (preset?.objectifGlobal ?? form.objectifsAudit).trim(),
      referentielNormatif: preset?.referentielNormatif ?? form.referentielNormatif,
      scopeType: selectedScope.scopeType,
      scopeId: selectedScope.scopeId,
      scopeLabel: selectedScope.scopeLabel,
      managerPilotUserId: form.managerPilotUserId,
      cycleEvaluation: form.cycleEvaluation.trim(),
      dateExecutionPrevisionnelle: form.dateExecutionPrevisionnelle,
      responsableAuditId: form.responsableAuditId,
      auditeursInternesIds: form.auditeursInternesIds,
      priorite: form.priorite || undefined,
      executionStatus: form.executionStatus || undefined,
      surveillanceControle: form.surveillanceControle.trim() || undefined,
    });
  };

  const toggleAuditor = (auditorId: string) => {
    setForm((prev) => ({
      ...prev,
      auditeursInternesIds: prev.auditeursInternesIds.includes(auditorId)
        ? prev.auditeursInternesIds.filter((id) => id !== auditorId)
        : [...prev.auditeursInternesIds, auditorId],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Établir un programme d'audit annuel"
      size='xl'>
      <form onSubmit={handleSubmit} className='space-y-5'>
        {preset && (
          <div className='rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-brand-700'>
              Spécificité
            </p>
            <div className='mt-2 flex flex-wrap items-center gap-2'>
              <span className='inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-800'>
                {AUDIT_PROGRAM_DOMAINS.find((item) => item.domaine === preset.domaine)?.label}
              </span>
              <span className='inline-flex rounded-full bg-white px-3 py-1 text-sm text-gray-700'>
                {preset.referentielNormatif}
              </span>
            </div>
          </div>
        )}

        <Textarea
          label='Objectif global annuel'
          value={preset?.objectifGlobal ?? form.objectifsAudit}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, objectifsAudit: event.target.value }))
          }
          placeholder='Objectif global annuel'
          readOnly={!!preset}
          disabled={!!preset}
          required
        />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {preset ? (
            <Input
              label='Référentiel normatif'
              value={preset.referentielNormatif}
              readOnly
            />
          ) : (
            <Select
              label='Référentiel normatif'
              options={REFERENTIEL_OPTIONS}
              value={form.referentielNormatif}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  referentielNormatif: event.target.value,
                }))
              }
              placeholder='Sélectionner un référentiel'
              required
            />
          )}

          <Select
            label={
              preset?.domaine === 'QUALITE'
                ? 'Processus à auditer'
                : 'Site / Unité de travail à auditer'
            }
            options={scopeOptions}
            value={form.scopeValue}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                scopeValue: event.target.value,
                managerPilotUserId: '',
              }))
            }
            placeholder={
              preset?.domaine === 'QUALITE'
                ? 'Sélectionner un processus'
                : 'Sélectionner un site ou une unité de travail'
            }
            searchable
            required
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Select
            label={
              preset?.domaine === 'SECURITE' || preset?.domaine === 'ENVIRONNEMENT'
                ? 'Chef'
                : 'Manager ou pilote'
            }
            options={managerPilotOptions}
            value={form.managerPilotUserId}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                managerPilotUserId: event.target.value,
              }))
            }
            placeholder='Sélectionner une personne liée'
            disabled={managerPilotOptions.length === 0}
            hint={
              selectedScope && managerPilotOptions.length === 0
                ? 'Aucun responsable lié à ce périmètre dans la cartographie.'
                : undefined
            }
            required
          />

          <Input
            label="Cycle d'évaluation"
            value={form.cycleEvaluation}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                cycleEvaluation: event.target.value,
              }))
            }
            placeholder='Ex: Trimestre 1 de 2026'
            required
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <DatePicker
            label="Date prévisionnelle d'exécution"
            value={form.dateExecutionPrevisionnelle}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                dateExecutionPrevisionnelle: value,
              }))
            }
            required
          />

          <Select
            label='Priorité'
            options={PRIORITY_OPTIONS}
            value={form.priorite}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                priorite: event.target.value as AuditProgramPriority,
              }))
            }
            placeholder='Sélectionner une priorité'
            required
          />

          <Select
            label='Statut'
            options={EXECUTION_STATUS_OPTIONS}
            value={form.executionStatus}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                executionStatus: event.target
                  .value as AuditProgramExecutionStatus,
              }))
            }
            placeholder='Sélectionner un statut'
            required
          />
        </div>

        <div className='rounded-xl border border-gray-200 p-4'>
          <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Select
              label="Responsable d'audit"
              options={auditorOptions}
              value={form.responsableAuditId}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  responsableAuditId: event.target.value,
                  auditeursInternesIds: prev.auditeursInternesIds.filter(
                    (id) => id !== event.target.value,
                  ),
                }))
              }
              placeholder='Sélectionner un responsable'
              searchable
              required
            />
            <div className='rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600'>
              Ajoute ensuite les autres auditeurs internes actifs dans l&apos;équipe.
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-medium text-gray-700'>
              Équipe d&apos;audit
            </p>
            <div className='max-h-52 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3'>
              {auditorOptions
                .filter((option) => option.value !== form.responsableAuditId)
                .map((option) => (
                  <label
                    key={option.value}
                    className='flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 hover:bg-gray-50'>
                    <input
                      type='checkbox'
                      checked={form.auditeursInternesIds.includes(option.value)}
                      onChange={() => toggleAuditor(option.value)}
                      className='mt-1 h-4 w-4 rounded border-gray-300 text-brand-500'
                    />
                    <span>
                      <span className='block text-sm font-medium text-gray-800'>
                        {option.label}
                      </span>
                      {option.description && (
                        <span className='block text-xs text-gray-500'>
                          {option.description}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              {auditorOptions.length === 0 && (
                <p className='text-sm text-gray-500'>
                  Aucun auditeur actif disponible.
                </p>
              )}
            </div>
          </div>
        </div>

        <Textarea
          label='Surveillance et contrôle'
          value={form.surveillanceControle}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              surveillanceControle: event.target.value,
            }))
          }
          placeholder="Ex: 04/02/2026 : Nous avons réalisé la planification de l'évaluation du processus et envoyé pour approbation."
        />

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={handleClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isLoading || !canSubmit}>
            {isLoading ? 'Création...' : 'Ajouter un programme'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
