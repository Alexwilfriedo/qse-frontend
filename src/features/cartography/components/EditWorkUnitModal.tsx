import { Button, Input, Modal, Select, type SelectOption } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { useEffect, useState } from 'react';
import { useUpdateWorkUnit } from '../hooks';
import { useEntityTree } from '../hooks/useEntityTree';
import { useMemo } from 'react';
import type { EntityTreeNode } from '../types';
import type { UpdateWorkUnitRequest, WorkUnitView } from '../workUnitTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workUnit: WorkUnitView | null;
}

export function EditWorkUnitModal({ isOpen, onClose, workUnit }: Props) {
  const [form, setForm] = useState<UpdateWorkUnitRequest>({
    name: '',
    code: '',
    location: '',
    department: '',
    chefUniteId: '',
  });
  const update = useUpdateWorkUnit();
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

  useEffect(() => {
    if (workUnit) {
      setForm({
        name: workUnit.name,
        code: workUnit.code,
        location: workUnit.location,
        department: workUnit.department,
        chefUniteId: workUnit.chefUniteId ?? '',
      });
    }
  }, [workUnit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workUnit) return;
    try {
      await update.mutateAsync({ id: workUnit.id, data: form });
      onClose();
    } catch {
      // toast géré par le hook
    }
  };

  const isValid =
    form.name.trim() &&
    form.code.trim() &&
    form.location.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Modifier une unité de travail' preserveState>
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
          <Button variant='secondary' type='button' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={update.isPending || !isValid}>
            {update.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
