import { Button, Modal } from '@/components/ui';
import { useDeleteWorkUnit } from '../hooks';
import type { WorkUnitView } from '../workUnitTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workUnit: WorkUnitView | null;
}

export function DeleteWorkUnitModal({ isOpen, onClose, workUnit }: Props) {
  const del = useDeleteWorkUnit();

  const handleDelete = async () => {
    if (!workUnit) return;
    try {
      await del.mutateAsync(workUnit.id);
      onClose();
    } catch {
      // toast géré par le hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Supprimer une unité de travail'>
      <div className='space-y-4'>
        <p className='text-gray-600 dark:text-gray-400'>
          Êtes-vous sûr de vouloir supprimer l’unité de travail{' '}
          <span className='font-medium text-gray-900 dark:text-white'>
            {workUnit?.name}
          </span>
          {' '}?
        </p>
        <div className='flex justify-end gap-3 pt-4'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={del.isPending}>
            {del.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
