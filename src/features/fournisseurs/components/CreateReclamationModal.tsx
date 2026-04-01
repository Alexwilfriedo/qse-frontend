import { Button, Input, Modal, Select } from '@/components/ui';
import { useState } from 'react';
import { useCreateReclamation } from '../hooks';
import type { CategorieReclamation, CreateReclamationRequest } from '../types';
import { CATEGORIE_RECLAMATION_OPTIONS } from '../types';

interface Props {
  fournisseurId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_FORM: CreateReclamationRequest = {
  objet: '',
  description: '',
  categorie: 'QUALITE',
};

export default function CreateReclamationModal({
  fournisseurId,
  isOpen,
  onClose,
}: Props) {
  const [form, setForm] = useState<CreateReclamationRequest>(DEFAULT_FORM);
  const createMutation = useCreateReclamation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({ fournisseurId, data: form });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Nouvelle réclamation'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Objet *
          </label>
          <Input
            type='text'
            value={form.objet}
            onChange={(e) => setForm({ ...form, objet: e.target.value })}
            placeholder='Objet de la réclamation'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Catégorie *
          </label>
          <Select
            options={CATEGORIE_RECLAMATION_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            value={form.categorie}
            onChange={(e) =>
              setForm({
                ...form,
                categorie: e.target.value as CategorieReclamation,
              })
            }
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Description
          </label>
          <textarea
            className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            rows={4}
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder='Description détaillée...'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Date de réclamation
          </label>
          <Input
            type='date'
            value={form.dateReclamation || ''}
            onChange={(e) =>
              setForm({ ...form, dateReclamation: e.target.value })
            }
          />
        </div>

        <div className='flex justify-end gap-3 pt-4'>
          <Button variant='secondary' onClick={onClose} type='button'>
            Annuler
          </Button>
          <Button
            type='submit'
            disabled={!form.objet.trim() || createMutation.isPending}>
            {createMutation.isPending ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
