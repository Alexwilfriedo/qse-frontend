import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, Input, Modal, Select } from '@/components/ui';
import { useEffect, useMemo, useState } from 'react';
import { useProcessMap } from '@/features/cartography/hooks/useProcessMap';
import { useIncidents } from '@/features/incidents/hooks';
import { useRisks } from '@/features/risks/hooks/useRisks';
import { auditsApi } from '@/features/audits/auditsApi';
import { useCampaigns } from '@/features/audits/hooks/useAudits';
import {
  ACTION_ORIGIN_OPTIONS,
  ACTION_TYPE_LABELS,
  getAllowedActionTypes,
} from '../actionOptions';
import type {
  ActionOrigine,
  ActionPriorite,
  ActionType,
  CreateActionRequest,
  Domaine,
} from '../types';
import { ResponsableSelector } from './ResponsableSelector';

interface CreateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateActionRequest) => void;
  isLoading: boolean;
}

const EMPTY_FORM = {
  titre: '',
  description: '',
  type: '' as ActionType | '',
  priorite: 'MOYENNE' as ActionPriorite,
  domaine: '' as Domaine | '',
  responsableId: '',
  verificateurId: '',
  echeance: '',
  origine: '' as ActionOrigine | '',
  origineId: '',
};

export function CreateActionModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateActionModalProps) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: processMap } = useProcessMap();
  const { data: incidentsPage } = useIncidents({ page: 0, size: 200 });
  const { data: risksPage } = useRisks({ page: 0, size: 200 });
  const { data: campaigns } = useCampaigns();
  const { data: auditOptionsData } = useQuery({
    queryKey: ['actions', 'audit-options', campaigns?.map((item) => item.id).join(',')],
    enabled: !!campaigns?.length,
    queryFn: async () => {
      const auditLists = await Promise.all(
        (campaigns ?? []).map(async (campaign) => {
          const audits = await auditsApi.getAudits(campaign.id);
          return audits.map((audit) => ({
            value: audit.id,
            label: `${audit.titre} - ${audit.datePrevisionnelle}`,
          }));
        }),
      );
      return auditLists.flat();
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Titre requis';
    }
    if (!formData.type) {
      newErrors.type = 'Type requis';
    }
    if (!formData.domaine) {
      newErrors.domaine = 'Domaine requis';
    }
    if (!formData.responsableId) {
      newErrors.responsableId = 'Responsable requis';
    }
    if (!formData.echeance) {
      newErrors.echeance = 'Échéance requise';
    }
    if (!formData.origine) {
      newErrors.origine = 'Origine requise';
    }
    if (relatedField && !formData.origineId) {
      newErrors.origineId = `${relatedField.label} requis`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const allowedTypes = getAllowedActionTypes(formData.origine);
  const typeOptions = allowedTypes.map((type) => ({
    value: type,
    label: ACTION_TYPE_LABELS[type],
  }));
  const processOptions = useMemo(
    () =>
      [
        ...(processMap?.management ?? []),
        ...(processMap?.realisation ?? []),
        ...(processMap?.support ?? []),
      ].map((process) => ({
        value: process.id,
        label: `${process.codification} - ${process.nom}`,
      })),
    [processMap],
  );
  const riskOptions = useMemo(
    () =>
      (risksPage?.content ?? []).map((risk) => ({
        value: risk.id,
        label: `${risk.code} - ${risk.title}`,
        domaine: risk.domaine,
      })),
    [risksPage],
  );
  const incidentOptions = useMemo(
    () =>
      (incidentsPage?.content ?? []).map((incident) => ({
        value: incident.id,
        label: `${incident.code} - ${incident.title}`,
      })),
    [incidentsPage],
  );
  const relatedField = useMemo(() => {
    switch (formData.origine) {
      case 'AUDIT_NON_CONFORMITE':
      case 'AUDIT':
        return {
          label: "Planning d'audit concerné",
          options: auditOptionsData ?? [],
        };
      case 'REVUE_ANALYSE_INCIDENT':
      case 'INCIDENT':
        return {
          label: 'Incident concerné',
          options: incidentOptions,
        };
      case 'OPPORTUNITES':
        return {
          label: 'Processus concerné',
          options: processOptions,
        };
      case 'MATRICE_RISQUES':
      case 'RISQUE':
        return {
          label: 'Risque concerné',
          options: riskOptions,
        };
      case 'DUERP':
        return {
          label: 'Risque concerné',
          options: riskOptions.filter((risk) => risk.domaine === 'QUALITE'),
        };
      case 'ANALYSE_ENVIRONNEMENTALE':
        return {
          label: 'Risque concerné',
          options: riskOptions.filter(
            (risk) => risk.domaine === 'ENVIRONNEMENT',
          ),
        };
      default:
        return null;
    }
  }, [auditOptionsData, formData.origine, incidentOptions, processOptions, riskOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        titre: formData.titre,
        description: formData.description || undefined,
        type: formData.type as ActionType,
        priorite: formData.priorite,
        domaine: formData.domaine as Domaine,
        responsableId: formData.responsableId,
        verificateurId: formData.verificateurId || undefined,
        echeance: formData.echeance,
        origine: formData.origine as ActionOrigine,
        origineId: formData.origineId || undefined,
      });
    }
  };

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Nouvelle action'>
      <form onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <Input
            label='Titre'
            required
            value={formData.titre}
            onChange={(e) =>
              setFormData((p) => ({ ...p, titre: e.target.value }))
            }
            error={errors.titre}
            placeholder="Titre de l'action"
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
              rows={3}
              placeholder="Description détaillée de l'action..."
              className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Select
              label='Origine'
              required
              placeholder='Selectionner'
              options={ACTION_ORIGIN_OPTIONS}
              value={formData.origine}
              onChange={(e) => {
                const origine = e.target.value as ActionOrigine;
                const nextAllowedTypes = getAllowedActionTypes(origine);
                setFormData((p) => ({
                  ...p,
                  origine,
                  origineId: '',
                  type: nextAllowedTypes.includes(p.type as ActionType)
                    ? p.type
                    : nextAllowedTypes[0],
                }));
              }}
              error={errors.origine}
            />
            <Select
              label='Type'
              required
              placeholder='Selectionner'
              disabled={!formData.origine || allowedTypes.length === 1}
              options={typeOptions}
              value={formData.type}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  type: e.target.value as ActionType,
                }))
              }
              error={errors.type}
            />
          </div>

          {relatedField && (
            <Select
              label={relatedField.label}
              required
              placeholder='Selectionner'
              options={relatedField.options}
              value={formData.origineId}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  origineId: e.target.value,
                }))
              }
              error={errors.origineId}
            />
          )}

          <div className='grid grid-cols-2 gap-4'>
            <Select
              label='Domaine'
              required
              placeholder='Selectionner'
              options={[
                { value: 'QUALITE', label: 'Qualite' },
                { value: 'SECURITE', label: 'Securite' },
                { value: 'ENVIRONNEMENT', label: 'Environnement' },
              ]}
              value={formData.domaine}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  domaine: e.target.value as Domaine,
                }))
              }
              error={errors.domaine}
            />
            <Select
              label='Priorite'
              options={[
                { value: 'BASSE', label: 'Basse' },
                { value: 'MOYENNE', label: 'Moyenne' },
                { value: 'HAUTE', label: 'Haute' },
                { value: 'CRITIQUE', label: 'Critique' },
              ]}
              value={formData.priorite}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  priorite: e.target.value as ActionPriorite,
                }))
              }
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
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

            <ResponsableSelector
              value={formData.verificateurId}
              onChange={(userId) =>
                setFormData((p) => ({ ...p, verificateurId: userId }))
              }
              label='Vérificateur'
              placeholder='Optionnel'
            />
          </div>

          <DatePicker
            label='Échéance'
            required
            value={formData.echeance}
            onChange={(v) => setFormData((p) => ({ ...p, echeance: v }))}
            error={errors.echeance}
          />
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <Button type='button' variant='ghost' onClick={handleClose}>
            Annuler
          </Button>
          <Button type='submit' isLoading={isLoading}>
            Créer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
