import { Button, DatePicker, Input, Modal, Select } from '@/components/ui';
import { ResponsableSelector } from '@/features/actions/components/ResponsableSelector';
import { useEntityTree } from '@/features/cartography/hooks/useEntityTree';
import { useProcessMap } from '@/features/cartography/hooks/useProcessMap';
import type { EntityTreeNode } from '@/features/cartography/types';
import { showToast } from '@/lib/toast';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  ActionEntry,
  CalculationFrequency,
  CreateKpiReportIndicatorRequest,
  KpiReportDomain,
} from '../kpiReportTypes';

interface CreateKpiReportIndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateKpiReportIndicatorRequest, actions: ActionEntry[]) => void;
  isLoading: boolean;
  domain: KpiReportDomain;
  period: string;
}

const FREQUENCY_OPTIONS = [
  { value: 'MENSUEL', label: 'Mensuel' },
  { value: 'TRIMESTRIEL', label: 'Trimestriel' },
  { value: 'SEMESTRIEL', label: 'Semestriel' },
  { value: 'ANNUEL', label: 'Annuel' },
];

const UNIT_OPTIONS = [
  { value: '%', label: '%' },
  { value: 'jr', label: 'Jours' },
];

const ACTION_TYPE_OPTIONS = [
  { value: 'CORRECTIVE', label: 'Corrective' },
  { value: 'PREVENTIVE', label: 'Préventive' },
];

const ACTION_STATUS_OPTIONS = [
  { value: 'OUVERTE', label: 'Ouverte' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'TERMINEE', label: 'Terminée' },
  { value: 'VALIDEE', label: 'Validée' },
  { value: 'REFUSEE', label: 'Refusée' },
];

const ACTION_PRIORITY_OPTIONS = [
  { value: 'BASSE', label: 'Basse' },
  { value: 'MOYENNE', label: 'Moyenne' },
  { value: 'HAUTE', label: 'Haute' },
  { value: 'CRITIQUE', label: 'Critique' },
];

const EMPTY_ACTION: ActionEntry = {
  type: 'CORRECTIVE',
  titre: '',
  responsableId: '',
  echeance: '',
  statut: 'OUVERTE',
  priorite: 'MOYENNE',
};

const EMPTY_FORM = {
  organizationalEntity: '',
  code: '',
  processId: '',
  processName: '',
  name: '',
  measureObjective: '',
  calculationFormula: '',
  unit: '',
  audience: '',
  dataOrigin: '',
  target: '',
  calculationFrequency: '' as CalculationFrequency | '',
  calculationResponsibleId: '',
  calculationResponsibleName: '',
  analysisResponsibleId: '',
  analysisResponsibleName: '',
  result: '',
  rootCause: '',
  measureAnalysis: '',
};

export function CreateKpiReportIndicatorModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
  domain,
  period,
}: CreateKpiReportIndicatorModalProps) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [actions, setActions] = useState<ActionEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formTopRef = useRef<HTMLDivElement>(null);
  const { data: processMap } = useProcessMap();
  const { data: entityTree } = useEntityTree();

  const flattenTree = (nodes: EntityTreeNode[]): { value: string; label: string }[] =>
    nodes.flatMap((node) => [
      { value: node.nom, label: node.nom },
      ...flattenTree(node.children),
    ]);

  const entityOptions = useMemo(
    () => (entityTree ? flattenTree(entityTree) : []),
    [entityTree],
  );

  const processOptions = useMemo(
    () =>
      [
        ...(processMap?.management ?? []),
        ...(processMap?.realisation ?? []),
        ...(processMap?.support ?? []),
      ].map((p) => ({
        value: p.id,
        label: `${p.codification} - ${p.nom}`,
      })),
    [processMap],
  );

  useEffect(() => {
    if (!isOpen) {
      setFormData(EMPTY_FORM);
      setActions([]);
      setErrors({});
    }
  }, [isOpen]);

  const addAction = () => setActions((prev) => [...prev, { ...EMPTY_ACTION }]);

  const removeAction = (index: number) =>
    setActions((prev) => prev.filter((_, i) => i !== index));

  const updateAction = (index: number, field: keyof ActionEntry, value: string) =>
    setActions((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.organizationalEntity)
      newErrors.organizationalEntity = 'Requis';
    if (!formData.code.trim()) newErrors.code = 'Requis';
    if (!formData.processId) newErrors.processId = 'Requis';
    if (!formData.name.trim()) newErrors.name = 'Requis';
    if (!formData.measureObjective.trim())
      newErrors.measureObjective = 'Requis';
    if (!formData.calculationFormula.trim())
      newErrors.calculationFormula = 'Requis';
    if (!formData.unit) newErrors.unit = 'Requis';
    if (!formData.target || Number(formData.target) <= 0)
      newErrors.target = 'La cible doit être > 0';
    if (!formData.calculationFrequency)
      newErrors.calculationFrequency = 'Requis';
    if (!formData.calculationResponsibleId)
      newErrors.calculationResponsibleId = 'Requis';
    if (!formData.analysisResponsibleId)
      newErrors.analysisResponsibleId = 'Requis';

    actions.forEach((a, i) => {
      if (!a.titre.trim()) newErrors[`action_${i}_titre`] = 'Requis';
      if (!a.responsableId) newErrors[`action_${i}_responsable`] = 'Requis';
      if (!a.echeance) newErrors[`action_${i}_echeance`] = 'Requis';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      showToast.error('Veuillez remplir tous les champs requis');
      return;
    }

    const request: CreateKpiReportIndicatorRequest = {
      domain,
      organizationalEntity: formData.organizationalEntity,
      code: formData.code,
      processId: formData.processId,
      processName: formData.processName,
      name: formData.name,
      measureObjective: formData.measureObjective,
      calculationFormula: formData.calculationFormula,
      unit: formData.unit,
      audience: formData.audience,
      dataOrigin: formData.dataOrigin,
      target: Number(formData.target),
      calculationFrequency: formData.calculationFrequency as CalculationFrequency,
      calculationResponsibleId: formData.calculationResponsibleId,
      calculationResponsibleName: formData.calculationResponsibleName,
      analysisResponsibleId: formData.analysisResponsibleId,
      analysisResponsibleName: formData.analysisResponsibleName,
      period,
      result: formData.result ? Number(formData.result) : undefined,
      rootCause: formData.rootCause || undefined,
      measureAnalysis: formData.measureAnalysis || undefined,
    };
    onSave(request, actions);
  };

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    setActions([]);
    setErrors({});
    onClose();
  };

  const hasResult = formData.result !== '';
  const targetReached =
    hasResult && formData.target !== ''
      ? Number(formData.result) >= Number(formData.target)
      : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Enregistrer un indicateur"
      size='xl'>
      <form onSubmit={handleSubmit}>
        <div ref={formTopRef} className='space-y-6'>
          {/* ── Section 1: Identification ── */}
          <fieldset>
            <legend className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2'>
              Identification de l'indicateur
            </legend>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Select
                  label='Entité organisationnelle'
                  required
                  searchable
                  placeholder='Sélectionner une entité'
                  options={entityOptions}
                  value={formData.organizationalEntity}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      organizationalEntity: e.target.value,
                    }))
                  }
                  error={errors.organizationalEntity}
                />
                <Input
                  label="Code de l'indicateur"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, code: e.target.value }))
                  }
                  error={errors.code}
                  placeholder='Ex: IND-SMQ-001'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <Select
                  label='Nom du processus'
                  required
                  searchable
                  placeholder='Sélectionner un processus'
                  options={processOptions}
                  value={formData.processId}
                  onChange={(e) => {
                    const opt = processOptions.find((o) => o.value === e.target.value);
                    setFormData((p) => ({
                      ...p,
                      processId: e.target.value,
                      processName: opt?.label ?? '',
                    }));
                  }}
                  error={errors.processId}
                />
                <Input
                  label="Nom de l'indicateur"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  error={errors.name}
                  placeholder="Nom de l'indicateur"
                />
              </div>

              <Input
                label='Objectif de la mesure'
                required
                value={formData.measureObjective}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    measureObjective: e.target.value,
                  }))
                }
                error={errors.measureObjective}
                placeholder="Pourquoi cet indicateur est mesuré"
              />

              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='Formule de calcul'
                  required
                  value={formData.calculationFormula}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      calculationFormula: e.target.value,
                    }))
                  }
                  error={errors.calculationFormula}
                  placeholder='Ex: (conformes / total) x 100'
                />
                <Select
                  label='Unité de mesure'
                  required
                  placeholder='Sélectionner'
                  options={UNIT_OPTIONS}
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, unit: e.target.value }))
                  }
                  error={errors.unit}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='Public (parties intéressées)'
                  value={formData.audience}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, audience: e.target.value }))
                  }
                  placeholder='À qui est adressé cet indicateur'
                />
                <Input
                  label='Origines des données'
                  value={formData.dataOrigin}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, dataOrigin: e.target.value }))
                  }
                  placeholder="Sources de données de l'indicateur"
                />
              </div>
            </div>
          </fieldset>

          {/* ── Section 2: Paramètres de calcul ── */}
          <fieldset>
            <legend className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2'>
              Paramètres de calcul
            </legend>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='Cible du calcul'
                  required
                  type='number'
                  value={formData.target}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, target: e.target.value }))
                  }
                  error={errors.target}
                  placeholder='Ex: 80'
                />
                <Select
                  label='Périodicité de calcul'
                  required
                  placeholder='Sélectionner'
                  options={FREQUENCY_OPTIONS}
                  value={formData.calculationFrequency}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      calculationFrequency:
                        e.target.value as CalculationFrequency,
                    }))
                  }
                  error={errors.calculationFrequency}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <ResponsableSelector
                    value={formData.calculationResponsibleId}
                    onChange={(userId, userName) =>
                      setFormData((p) => ({
                        ...p,
                        calculationResponsibleId: userId,
                        calculationResponsibleName: userName,
                      }))
                    }
                    label='Responsable du calcul (pilote)'
                    required
                  />
                  {errors.calculationResponsibleId && (
                    <p className='mt-1 text-xs text-red-500'>
                      {errors.calculationResponsibleId}
                    </p>
                  )}
                </div>
                <div>
                  <ResponsableSelector
                    value={formData.analysisResponsibleId}
                    onChange={(userId, userName) =>
                      setFormData((p) => ({
                        ...p,
                        analysisResponsibleId: userId,
                        analysisResponsibleName: userName,
                      }))
                    }
                    label="Responsable de l'analyse (manager)"
                    required
                  />
                  {errors.analysisResponsibleId && (
                    <p className='mt-1 text-xs text-red-500'>
                      {errors.analysisResponsibleId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* ── Section 3: Résultat et analyse ── */}
          <fieldset>
            <legend className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2'>
              Résultat et analyse (optionnel à la création)
            </legend>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='Résultat du calcul'
                  type='number'
                  value={formData.result}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, result: e.target.value }))
                  }
                  placeholder='Valeur obtenue'
                />
                {targetReached !== null && (
                  <div className='flex items-end pb-2'>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                        targetReached
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {targetReached ? 'Cible atteinte' : 'Cible non atteinte'}
                    </span>
                  </div>
                )}
              </div>

              {hasResult && !targetReached && (
                <>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Cause racine
                    </label>
                    <textarea
                      value={formData.rootCause}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          rootCause: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder='En lien avec le résultat obtenu...'
                      className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Analyse de la mesure
                    </label>
                    <textarea
                      value={formData.measureAnalysis}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          measureAnalysis: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder="Pourquoi l'indicateur a atteint ce résultat..."
                      className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
                    />
                  </div>
                </>
              )}
            </div>
          </fieldset>

          {/* ── Section 4: Actions d'amélioration (si cible non atteinte) ── */}
          {hasResult && targetReached === false && (
          <fieldset>
            <legend className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2'>
              Actions d'amélioration
            </legend>

            {actions.length === 0 && (
              <p className='text-sm text-gray-400 dark:text-gray-500 mb-3'>
                Aucune action ajoutée
              </p>
            )}

            <div className='space-y-4'>
              {actions.map((action, index) => (
                <div
                  key={index}
                  className='relative rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                      Action {index + 1}
                    </span>
                    <button
                      type='button'
                      onClick={() => removeAction(index)}
                      className='rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <Select
                      label="Type d'action"
                      required
                      options={ACTION_TYPE_OPTIONS}
                      value={action.type}
                      onChange={(e) =>
                        updateAction(index, 'type', e.target.value)
                      }
                    />
                    <Input
                      label='Titre'
                      required
                      value={action.titre}
                      onChange={(e) =>
                        updateAction(index, 'titre', e.target.value)
                      }
                      error={errors[`action_${index}_titre`]}
                      placeholder="Titre de l'action"
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <ResponsableSelector
                        value={action.responsableId}
                        onChange={(userId) =>
                          updateAction(index, 'responsableId', userId)
                        }
                        label="Responsable de l'action"
                        required
                      />
                      {errors[`action_${index}_responsable`] && (
                        <p className='mt-1 text-xs text-red-500'>
                          {errors[`action_${index}_responsable`]}
                        </p>
                      )}
                    </div>
                    <DatePicker
                      label='Échéance'
                      required
                      value={action.echeance}
                      onChange={(v) =>
                        updateAction(index, 'echeance', v)
                      }
                      error={errors[`action_${index}_echeance`]}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <Select
                      label='Priorité'
                      options={ACTION_PRIORITY_OPTIONS}
                      value={action.priorite}
                      onChange={(e) =>
                        updateAction(index, 'priorite', e.target.value)
                      }
                    />
                    <Select
                      label='Statut'
                      options={ACTION_STATUS_OPTIONS}
                      value={action.statut}
                      onChange={(e) =>
                        updateAction(index, 'statut', e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              <Button
                type='button'
                variant='secondary'
                size='sm'
                leftIcon={<Plus className='w-4 h-4' />}
                onClick={addAction}>
                Ajouter une action
              </Button>
            </div>
          </fieldset>
          )}
        </div>

        <div className='flex justify-end gap-3 pt-4'>
          <Button type='button' variant='secondary' onClick={handleClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
