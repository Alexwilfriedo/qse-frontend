import { Button, DatePicker, Input, Modal, Select } from '@/components/ui';
import { useEffect, useState } from 'react';
import {
  ACTION_ORIGIN_OPTIONS,
  ACTION_TYPE_LABELS,
  getAllowedActionTypes,
} from '../actionOptions';
import type {
  Action,
  ActionPriorite,
  ActionType,
  Domaine,
  UpdateActionRequest,
} from '../types';
import { ResponsableSelector } from './ResponsableSelector';

interface EditActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: Action;
  onSave: (data: UpdateActionRequest) => void;
  isLoading: boolean;
}

export function EditActionModal({
  isOpen,
  onClose,
  action,
  onSave,
  isLoading,
}: EditActionModalProps) {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: '' as ActionType,
    priorite: 'MOYENNE' as ActionPriorite,
    domaine: '' as Domaine,
    responsableId: '',
    verificateurId: '',
    echeance: '',
  });

  useEffect(() => {
    if (action) {
      setFormData({
        titre: action.titre,
        description: action.description ?? '',
        type: action.type,
        priorite: action.priorite,
        domaine: action.domaine,
        responsableId: action.responsableId,
        verificateurId: action.verificateurId ?? '',
        echeance: action.echeance,
      });
    }
  }, [action]);

  const allowedTypes = getAllowedActionTypes(action.origine);
  const typeOptions = allowedTypes.map((type) => ({
    value: type,
    label: ACTION_TYPE_LABELS[type],
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      titre: formData.titre,
      description: formData.description || undefined,
      type: formData.type,
      priorite: formData.priorite,
      domaine: formData.domaine,
      responsableId: formData.responsableId,
      verificateurId: formData.verificateurId || undefined,
      echeance: formData.echeance,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier l'action">
      <form onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <Input
            label='Titre'
            value={formData.titre}
            onChange={(e) =>
              setFormData((p) => ({ ...p, titre: e.target.value }))
            }
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
              className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Select
              label='Type'
              disabled={allowedTypes.length === 1}
              options={typeOptions}
              value={formData.type}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  type: e.target.value as ActionType,
                }))
              }
            />
            <Select
              label='Domaine'
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
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Select
              label='Origine'
              disabled
              options={ACTION_ORIGIN_OPTIONS}
              value={action.origine}
              onChange={() => undefined}
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
            <DatePicker
              label='Echeance'
              value={formData.echeance}
              onChange={(v) => setFormData((p) => ({ ...p, echeance: v }))}
            />
            <ResponsableSelector
              value={formData.responsableId}
              onChange={(userId) =>
                setFormData((p) => ({ ...p, responsableId: userId }))
              }
              label='Responsable'
            />

            <ResponsableSelector
              value={formData.verificateurId}
              onChange={(userId) =>
                setFormData((p) => ({ ...p, verificateurId: userId }))
              }
              label='Vérificateur'
              placeholder='Optionnel'
            />
          </div>
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <Button type='button' variant='ghost' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' isLoading={isLoading}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
