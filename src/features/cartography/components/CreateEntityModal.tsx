import { Button, Input, Modal, Select } from '@/components/ui';
import { useEffect, useState } from 'react';
import { useCreateEntity, useEntityTypeOptions } from '../hooks';
import type { CreateEntityRequest, EntityTreeNode } from '../types';

interface CreateEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentNode?: EntityTreeNode | null;
}

export function CreateEntityModal({
  isOpen,
  onClose,
  parentNode,
}: CreateEntityModalProps) {
  const [form, setForm] = useState<CreateEntityRequest>({
    nom: '',
    type: 'SERVICE',
    parentId: parentNode?.id,
  });
  const createEntity = useCreateEntity();
  const { options: entityTypeOptions } = useEntityTypeOptions();

  useEffect(() => {
    if (entityTypeOptions.length === 0) {
      return;
    }

    setForm((prev) => {
      if (entityTypeOptions.some((option) => option.value === prev.type)) {
        return prev;
      }

      return {
        ...prev,
        type: entityTypeOptions[0].value,
      };
    });
  }, [entityTypeOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEntity.mutate(
      { ...form, parentId: parentNode?.id },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        parentNode ? `Ajouter sous "${parentNode.nom}"` : 'Nouvelle entité'
      }>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Nom'
          value={form.nom}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, nom: e.target.value }))
          }
          required
          placeholder='Ex: Direction Technique'
        />
        <Input
          label='Nom court'
          value={form.nomCourt || ''}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              nomCourt: e.target.value || undefined,
            }))
          }
          placeholder='Ex: DT'
        />
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Type
          </label>
          <Select
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                type: e.target.value as CreateEntityRequest['type'],
              }))
            }
            options={entityTypeOptions}
          />
        </div>
        <Input
          label='Description'
          value={form.description || ''}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description: e.target.value || undefined,
            }))
          }
          placeholder='Description optionnelle'
        />
        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={onClose}>
            Annuler
          </Button>
          <Button
            type='submit'
            disabled={createEntity.isPending || !form.nom.trim()}>
            {createEntity.isPending ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
