import { Button, Modal } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';
import type { Action } from '../types';

interface DeleteActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: Action;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteActionModal({
  isOpen,
  onClose,
  action,
  onConfirm,
  isLoading,
}: DeleteActionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer l'action">
      <div className='flex flex-col items-center text-center'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
          <AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' />
        </div>

        <h3 className='mt-4 text-lg font-semibold text-gray-900 dark:text-white'>
          Confirmer la suppression
        </h3>

        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          Êtes-vous sûr de vouloir supprimer l'action{' '}
          <span className='font-medium text-gray-900 dark:text-white'>
            "{action.titre}"
          </span>
          ? Cette action est irréversible.
        </p>
      </div>

      <div className='mt-6 flex justify-center gap-3'>
        <Button type='button' variant='ghost' onClick={onClose}>
          Annuler
        </Button>
        <Button
          type='button'
          variant='destructive'
          onClick={onConfirm}
          isLoading={isLoading}>
          Supprimer
        </Button>
      </div>
    </Modal>
  );
}
