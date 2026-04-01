import { Button, Modal } from '@/components/ui';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className='space-y-4'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{message}</p>
        <div className='flex justify-end gap-3'>
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
      </div>
    </Modal>
  );
}
