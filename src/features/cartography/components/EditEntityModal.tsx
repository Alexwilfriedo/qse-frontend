import { Button, Input, Modal, Select } from '@/components/ui';
import { useEffect, useState } from 'react';
import { useEntityTypeOptions, useUpdateEntity } from '../hooks';
import type { EntityTreeNode, EntityType, UpdateEntityRequest } from '../types';

interface EditEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: EntityTreeNode | null;
}

export function EditEntityModal({
  isOpen,
  onClose,
  entity,
}: EditEntityModalProps) {
  const [form, setForm] = useState<UpdateEntityRequest>({
    nom: '',
    type: 'SERVICE',
  });
  const updateEntity = useUpdateEntity();
  const { options: entityTypeOptions } = useEntityTypeOptions();

  const selectOptions = form.type
    ? entityTypeOptions.some((option) => option.value === form.type)
      ? entityTypeOptions
      : [{ value: form.type, label: form.type }, ...entityTypeOptions]
    : entityTypeOptions;

  useEffect(() => {
    if (entity) {
      setForm({
        nom: entity.nom,
        nomCourt: entity.nomCourt ?? undefined,
        type: entity.type,
        description: entity.description ?? undefined,
      });
    }
  }, [entity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entity) return;

    updateEntity.mutate(
      { id: entity.id, data: form },
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
      title={`Modifier "${entity?.nom ?? ''}"`}>
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
                type: e.target.value as EntityType,
              }))
            }
            options={selectOptions}
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
            disabled={updateEntity.isPending || !form.nom.trim()}>
            {updateEntity.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
