import { Button, Input, Modal, Select, type SelectOption } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { useEffect, useMemo, useState } from 'react';
import { useCreateWorkUnit } from '../hooks';
import { useEntityTree } from '../hooks/useEntityTree';
import type { EntityTreeNode } from '../types';
import type { CreateWorkUnitRequest } from '../workUnitTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_FORM: CreateWorkUnitRequest = {
  name: '',
  code: '',
  location: '',
  department: '',
  chefUniteId: '',
};

export function CreateWorkUnitModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateWorkUnitRequest>(EMPTY_FORM);
  const create = useCreateWorkUnit();
  const entityTree = useEntityTree();
  const { data: users } = useUsers();

  const siteOptions = useMemo((): SelectOption[] => {
    const flatten = (nodes: EntityTreeNode[], depth: number): SelectOption[] => {
      return nodes.flatMap((n) => {
        const labelPrefix = depth > 0 ? `${'—'.repeat(depth)} ` : '';
        const self: SelectOption[] =
          n.type === 'SITE'
            ? [{ value: n.nom, label: `${labelPrefix}${n.nom}` }]
            : [];
        return [...self, ...flatten(n.children ?? [], depth + 1)];
      });
    };

    return flatten(entityTree.data ?? [], 0);
  }, [entityTree.data]);

  const userOptions = useMemo(
    (): SelectOption[] =>
      (users ?? [])
        .filter((user) => user.active)
        .map((user) => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName} (${user.email})`,
        })),
    [users],
  );

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create.mutateAsync(form);
      handleClose();
    } catch {
      // toast géré par le hook
    }
  };

  const isValid =
    form.name.trim() &&
    form.code.trim() &&
    form.location.trim();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Nouvelle unité de travail'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label="Nom de l'UT"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
        <Input
          label='Code'
          value={form.code}
          onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
          required
        />
        <Select
          label='Site'
          value={form.location}
          options={siteOptions}
          placeholder={entityTree.isLoading ? 'Chargement...' : 'Sélectionner...'}
          searchable
          disabled={entityTree.isLoading || siteOptions.length === 0}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              location: e.target.value,
              department: e.target.value,
            }))
          }
          required
        />
        <Select
          label="Chef d'unité"
          value={form.chefUniteId ?? ''}
          options={userOptions}
          placeholder='Sélectionner...'
          searchable
          clearable
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              chefUniteId: e.target.value || undefined,
            }))
          }
        />

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={handleClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={create.isPending || !isValid}>
            {create.isPending ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
