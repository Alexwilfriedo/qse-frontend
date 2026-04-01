import { Button, Input, Modal, Select } from '@/components/ui';
import { useState } from 'react';
import { useCreateLink, useProcessMap } from '../hooks';
import type { CreateLinkRequest, ProcessLinkType } from '../processTypes';
import { LINK_TYPES } from '../processTypes';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceProcessId: string;
  sourceProcessName: string;
}

export function CreateLinkModal({
  isOpen,
  onClose,
  sourceProcessId,
  sourceProcessName,
}: CreateLinkModalProps) {
  const [form, setForm] = useState<CreateLinkRequest>({
    targetId: '',
    type: 'CLIENT',
  });
  const createLink = useCreateLink();
  const { data: map } = useProcessMap();

  const allProcesses = map
    ? [...map.management, ...map.realisation, ...map.support].filter(
        (p) => p.id !== sourceProcessId,
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLink.mutate(
      {
        sourceId: sourceProcessId,
        data: {
          ...form,
          description: form.description || undefined,
        },
      },
      {
        onSuccess: () => {
          setForm({ targetId: '', type: 'CLIENT' });
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setForm({ targetId: '', type: 'CLIENT' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Lier "${sourceProcessName}"`}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Type de lien
          </label>
          <Select
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                type: e.target.value as ProcessLinkType,
              }))
            }
            options={LINK_TYPES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Processus cible
          </label>
          <Select
            value={form.targetId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, targetId: e.target.value }))
            }
            placeholder='Sélectionner un processus'
            options={allProcesses.map((p) => ({
              value: p.id,
              label: `${p.nom} (${p.codification})`,
            }))}
          />
        </div>

        <Input
          label='Description (optionnel)'
          value={form.description || ''}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description: e.target.value || undefined,
            }))
          }
          placeholder='Nature de la relation'
        />

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={handleClose}>
            Annuler
          </Button>
          <Button
            type='submit'
            disabled={createLink.isPending || !form.targetId}>
            {createLink.isPending ? 'Création...' : 'Créer le lien'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
