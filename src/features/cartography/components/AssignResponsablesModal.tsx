import { Button, Modal } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAssignResponsables } from '../hooks';
import type { EntityTreeNode } from '../types';

interface AssignResponsablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: EntityTreeNode | null;
}

export function AssignResponsablesModal({
  isOpen,
  onClose,
  entity,
}: AssignResponsablesModalProps) {
  const { data: users } = useUsers();
  const assignResponsables = useAssignResponsables();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (entity) {
      setSelected(new Set(entity.responsableIds));
    }
  }, [entity]);

  const handleToggle = (userId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!entity) return;
    assignResponsables.mutate(
      {
        id: entity.id,
        data: { responsableIds: Array.from(selected) },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Responsables — ${entity?.nom ?? ''}`}>
      <div className='space-y-4'>
        {(users ?? []).length === 0 ? (
          <p className='text-sm text-gray-500 text-center py-4'>
            Aucun utilisateur disponible.
          </p>
        ) : (
          <div className='max-h-64 overflow-y-auto space-y-1'>
            {(users ?? []).map((user) => (
              <label
                key={user.id}
                className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={selected.has(user.id)}
                  onChange={() => handleToggle(user.id)}
                  className='h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500'
                />
                <span className='text-sm text-gray-900 dark:text-white'>
                  {user.firstName} {user.lastName}
                </span>
                <span className='text-xs text-gray-400'>{user.email}</span>
              </label>
            ))}
          </div>
        )}

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={assignResponsables.isPending}>
            <Save className='w-4 h-4 mr-1' />
            {assignResponsables.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
